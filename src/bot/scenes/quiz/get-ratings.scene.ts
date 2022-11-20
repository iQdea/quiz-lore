import { Scenes } from 'telegraf';
import axios from 'axios';
import { getQuizActionsKeyboard } from '../index';

export const getQuizRatingsWizard = new Scenes.WizardScene<any>(
  'GET_RATINGS',
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
    let res;
    try {
      res = await axios.get(`http://localhost:3300/quiz/ratings`, { params: { quizId: ctx.message.text } });
      const { data: quiz_ratings } = res.data;
      const ids = [];
      if (quiz_ratings.length === 0) {
        const { message_id: errid } = await ctx.reply(`Не найдено ни одного участия в квизе`);
        ids.push(errid);
      }
      for (const rate of quiz_ratings) {
        const { message_id: msgid } = await ctx.reply(
          `ID участника: ${rate.participantId} \n\n` +
            `Ник участника: ${rate.participantNick} \n\n` +
            `Рейтинг: ${rate.rating} \n\n`
        );
        ids.push(msgid);
      }
      const { message_id: dialogid } = await ctx.reply('Действия с квизом 🔍', getQuizActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: ids });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.data.message}`);
    }
    await ctx.scene.leave();
  }
);
