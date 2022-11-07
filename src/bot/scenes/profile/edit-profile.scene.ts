import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';
import { getProfileActionsKeyboard } from '../index';

let headerList: any;
export const editProfileWizard = new Scenes.WizardScene<any>(
  'EDIT_PROFILE',
  async (ctx) => {
    if (ctx.session.messageMark && ctx.session.messageMark === ctx.session.last_bot_message_id) {
      ctx.deleteMessage();
    }
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    try {
      headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    } catch {
      ctx.reply('Чтобы получить профиль, нужно сначала войти :)');
    }
    const { message_id: msgid } = await ctx.reply(
      'Введите атрибут для изменения',
      Markup.inlineKeyboard([
        Markup.button.callback('Имя', 'firstName'),
        Markup.button.callback('Фамилия', 'lastName'),
        Markup.button.callback('День рождения', 'birthDate')
      ])
    );
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { edit: { propertyName: ctx.update.callback_query.data } });
    const { message_id: msgid } = await ctx.reply('Введите новое значение');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state.edit, { propertyValue: ctx.message.text });
    ctx.deleteMessage(ctx.message.message_id);
    const changes = {} as Dictionary;
    changes[ctx.wizard.state.edit.propertyName] = ctx.wizard.state.edit.propertyValue;
    let res;
    try {
      res = await axios.patch(
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
      const { message_id: msgid } = await ctx.reply(
        `ID: ${user.id} \n\n` +
          `Имя: ${user.firstName} \n\n` +
          `Фамилия: ${user.lastName} \n\n` +
          `День рождения: ${user.birthDate} \n\n`
      );
      ctx.session.last_bot_message_id = msgid;
      ctx.reply('Действия с профилем', getProfileActionsKeyboard());
      Object.assign(ctx.session, { messageMark: msgid });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
