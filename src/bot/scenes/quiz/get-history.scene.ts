import { Scenes } from 'telegraf';
import axios from 'axios';
import { getQuizActionsKeyboard } from '../index';

export const getQuizHistoryWizard = new Scenes.WizardScene<any>('GET_HISTORY', async (ctx) => {
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  let res;
  try {
    res = await axios.get('http://localhost:3300/quiz/history');
    const { data: quiz_history } = res.data;
    const ids = [];
    if (quiz_history.length === 0) {
      const { message_id: errid } = await ctx.reply(`Не найдено ни одного квиза`);
      ids.push(errid);
    }
    for (const quiz of quiz_history) {
      const { message_id: msgid } = await ctx.reply(
        `ID: ${quiz.id} \n\n` +
          `Название: ${quiz.displayName} \n\n` +
          `Описание: ${quiz.description} \n\n` +
          `Активен: ${quiz.isActive ? 'Да' : 'Нет'} \n\n` +
          `Участники: ${JSON.stringify(quiz.participants.map((x: any) => x.id))} \n\n` +
          `Вопросы: ${JSON.stringify(quiz.questions.map((x: any) => x.id))} \n\n`
      );
      ids.push(msgid);
    }
    const { message_id: dialogid } = await ctx.reply('Действия с квизом', getQuizActionsKeyboard());
    ctx.session.last_bot_message_id = dialogid;
    Object.assign(ctx.session, { messageCounter: ids });
  } catch (error: any) {
    ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
  }
  await ctx.scene.leave();
});
