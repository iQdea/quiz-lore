import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';
import { getQuestionsActionsKeyboard } from '../index';

let headerList: any;
export const editQuestionWizard = new Scenes.WizardScene<any>(
  'EDIT_QUESTION',
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
      ctx.reply('Чтобы изменить вопрос, нужно сначала войти 🚪 :)');
      return;
    }
    const { message_id: msgid } = await ctx.reply('Введите id вопроса');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { edit: { questionId: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply(
      'Введите атрибут для изменения',
      Markup.inlineKeyboard([Markup.button.callback('Вопрос', 'question')])
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
        `http://localhost:3300/question/${ctx.wizard.state.edit.questionId}`,
        { ...changes },
        {
          headers: {
            Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
          }
        }
      );
      const { data: question } = res.data;
      const { message_id: msgid } = await ctx.reply(
        `ID: ${question.id} \n\n` + `Вопрос: ${question.question} \n\n` + `ID квиза: ${question.quizId} \n\n`
      );
      const { message_id: dialogid } = await ctx.reply('Действия с вопросами ❓', getQuestionsActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: [msgid] });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
