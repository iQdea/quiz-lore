import { Scenes } from 'telegraf';
import axios from 'axios';
import { getQuestionsActionsKeyboard } from '../index';

let headerList: any;
export const createQuestionWizard = new Scenes.WizardScene<any>(
  'CREATE_QUESTION',
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
      ctx.reply('Чтобы создать вопрос, нужно сначала войти 🚪 :)');
      return;
    }
    const { message_id: msgid } = await ctx.reply('Введите вопрос');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { questionObject: { question: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply('Введите id квиза');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state.questionObject, { quizId: ctx.message.text });
    ctx.deleteMessage(ctx.message.message_id);
    let res;
    try {
      res = await axios.post('http://localhost:3300/question', ctx.wizard.state.questionObject, {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      });
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
