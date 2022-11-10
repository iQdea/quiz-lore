import { Scenes } from 'telegraf';
import axios from 'axios';
import { getQuestionsActionsKeyboard } from '../index';

let headerList: any;
export const deleteQuestionWizard = new Scenes.WizardScene<any>(
  'DELETE_QUESTION',
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
      ctx.reply('Чтобы удалить вопрос, нужно сначала войти :)');
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
    const { message_id: msgid } = await ctx.reply('Введите id квиза');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state.edit, { quizId: ctx.message.text });
    ctx.deleteMessage(ctx.message.message_id);
    try {
      await axios.delete(`http://localhost:3300/question`, {
        params: {
          question_id: ctx.wizard.state.edit.questionId,
          quiz_id: ctx.wizard.state.edit.quizId
        },
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      });
      const { message_id: msgid } = await ctx.reply('Успешно удалено');
      const { message_id: dialogid } = await ctx.reply('Действия с вопросами', getQuestionsActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: [msgid] });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
