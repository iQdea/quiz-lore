import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';
import { getOptionsActionsKeyboard } from '../index';
import appConfig from '../../../app.config';

let headerList: any;
export const editOptionWizard = new Scenes.WizardScene<any>(
  'EDIT_OPTION',
  async (ctx) => {
    if (ctx.session.messageCounter) {
      for (const i of ctx.session.messageCounter) {
        ctx.deleteMessage(i);
      }
      ctx.session.messageCounter = undefined;
    }
    if (ctx.session.last_bot_message_id) {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
    }
    try {
      headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    } catch {
      ctx.reply(
        'Чтобы изменить опцию, нужно сначала войти 🚪 :)',
        Markup.inlineKeyboard([Markup.button.callback('Войти 🚪', 'signinup')], { columns: 2 })
      );
      return;
    }
    const { message_id: msgid } = await ctx.reply('Введите id опции');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { edit: { optionId: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply(
      'Введите атрибут для изменения',
      Markup.inlineKeyboard([
        Markup.button.callback('Текст', 'text'),
        Markup.button.callback('Является ли ответом', 'isAnswer')
      ])
    );
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state.edit, { propertyName: ctx.update.callback_query.data });
    const { message_id: msgid } = await ctx.reply('Введите новое значение');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    if (ctx.message.text === 'true') {
      Object.assign(ctx.wizard.state.edit, { propertyValue: true });
    } else if (ctx.message.text === 'false') {
      Object.assign(ctx.wizard.state.edit, { propertyValue: false });
    } else {
      Object.assign(ctx.wizard.state.edit, { propertyValue: ctx.message.text });
    }
    ctx.deleteMessage(ctx.message.message_id);
    const changes = {} as Dictionary;
    changes[ctx.wizard.state.edit.propertyName] = ctx.wizard.state.edit.propertyValue;
    let res;
    try {
      res = await axios.patch(
        `${appConfig().host}/option/${ctx.wizard.state.edit.optionId}`,
        { ...changes },
        {
          headers: {
            Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
          }
        }
      );
      const { data: option } = res.data;
      const { message_id: msgid } = await ctx.reply(
        `ID: ${option.id} \n\n` +
          `Текст: ${option.text} \n\n` +
          `Ответ: ${option.isAnswer ? '✔Да' : '❌Нет'} \n\n` +
          `ID вопроса: ${option.questionId} \n\n`
      );
      const { message_id: dialogid } = await ctx.reply('Действия с опциями 📝', getOptionsActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: [msgid] });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.data ? error.data.message : error.message}`);
    }
    await ctx.scene.leave();
  }
);
