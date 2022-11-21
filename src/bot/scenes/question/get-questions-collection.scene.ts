import { Scenes } from 'telegraf';
import axios from 'axios';
import { getQuestionsActionsKeyboard } from '../index';

export const getQuestionsCollectionWizard = new Scenes.WizardScene<any>(
  'GET_QUESTIONS_COLLECTION',
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
    const { message_id: msgid } = await ctx.reply('Введите id квиза');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    let res;
    try {
      res = await axios.get(`http://localhost:3300/question/${ctx.message.text}`);
      ctx.deleteMessage(ctx.message.message_id);
      const { data: questions_collection } = res.data;
      const ids = [];
      if (questions_collection.length === 0) {
        const { message_id: errid } = await ctx.reply(`Не найдено ни одного вопроса`);
        ids.push(errid);
      }
      for (const question of questions_collection) {
        const { message_id: msgid } = await ctx.reply(
          `ID: ${question.id} \n\n` + `Вопрос: ${question.question} \n\n` + `ID квиза: ${question.quizId} \n\n`
        );
        ids.push(msgid);
      }
      const { message_id: dialogid } = await ctx.reply('Действия с вопросами ❓', getQuestionsActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: ids });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.data ? error.data.message : error.message}`);
    }
    await ctx.scene.leave();
  }
);
