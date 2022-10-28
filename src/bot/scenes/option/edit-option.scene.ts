import { Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const editOptionWizard = new Scenes.WizardScene<any>(
  'EDIT_OPTION',
  async (ctx) => {
    ctx.reply('Enter option id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { edit: { optionId: ctx.message.text } });
    ctx.reply('Enter property to change');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.edit, { propertyName: ctx.message.text });
    ctx.reply('Enter new value');
    await ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === 'true') {
      Object.assign(ctx.wizard.state.edit, { propertyValue: true });
    } else if (ctx.message.text === 'false') {
      Object.assign(ctx.wizard.state.edit, { propertyValue: false });
    } else {
      Object.assign(ctx.wizard.state.edit, { propertyValue: ctx.message.text });
    }
    const changes = {} as Dictionary;
    changes[ctx.wizard.state.edit.propertyName] = ctx.wizard.state.edit.propertyValue;
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    const res = await axios.patch(
      `http://localhost:3300/option/${ctx.wizard.state.edit.optionId}`,
      { ...changes },
      {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      }
    );
    const { data: option } = res.data;
    ctx.reply(
      `ID: ${option.id} \n\n` +
        `Текст: ${option.text} \n\n` +
        `Ответ: ${option.isAnswer ? 'Да' : 'Нет'} \n\n` +
        `ID вопроса: ${option.questionId} \n\n`
    );
    await ctx.scene.leave();
  }
);
