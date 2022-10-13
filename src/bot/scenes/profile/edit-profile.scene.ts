import { Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const editProfileWizard = new Scenes.WizardScene<any>(
  'EDIT_PROFILE',
  async (ctx) => {
    ctx.reply('Enter property to change');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { edit: { propertyName: ctx.message.text } });
    ctx.reply('Enter new value');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.edit, { propertyValue: ctx.message.text });
    const changes = {} as Dictionary;
    changes[ctx.wizard.state.edit.propertyName] = ctx.wizard.state.edit.propertyValue;
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    const res = await axios.patch(
      'http://localhost:3300/user',
      { ...changes },
      {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      }
    );
    const {
      data: { user }
    } = res.data;
    ctx.reply(
      `ID: ${user.id} \n\n` +
        `Имя: ${user.firstName} \n\n` +
        `Фамилия: ${user.lastName} \n\n` +
        `День рождения: ${user.birthDate} \n\n`
    );
    await ctx.scene.leave();
  }
);
