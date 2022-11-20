import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';
import { getQuizActionsKeyboard } from '../index';

let headerList: any;
export const editQuizWizard = new Scenes.WizardScene<any>(
  'EDIT_QUIZ',
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
      ctx.reply('Чтобы изменить квиз, нужно сначала войти 🚪 :)');
      return;
    }
    const { message_id: msgid } = await ctx.reply('Введите id квиза');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { edit: { quizId: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply(
      'Введите атрибут для изменения',
      Markup.inlineKeyboard([
        Markup.button.callback('Название', 'displayName'),
        Markup.button.callback('Описание', 'description')
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
    Object.assign(ctx.wizard.state.edit, { propertyValue: ctx.message.text });
    ctx.deleteMessage(ctx.message.message_id);
    const changes = {} as Dictionary;
    changes[ctx.wizard.state.edit.propertyName] = ctx.wizard.state.edit.propertyValue;
    let res;
    try {
      res = await axios.patch(
        `http://localhost:3300/quiz/${ctx.wizard.state.edit.quizId}`,
        { ...changes },
        {
          headers: {
            Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
          }
        }
      );
      const { data: quiz } = res.data;
      const { message_id: msgid } = await ctx.reply(
        `ID: ${quiz.id} \n\n` + `Название: ${quiz.displayName} \n\n` + `Описание: ${quiz.description} \n\n`
      );
      const { message_id: dialogid } = await ctx.reply('Действия с квизом 🔍', getQuizActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: [msgid] });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.data.message}`);
    }
    await ctx.scene.leave();
  }
);
