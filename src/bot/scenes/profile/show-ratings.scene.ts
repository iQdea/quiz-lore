import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { getProfileActionsKeyboard } from '../index';

export const showRatingsWizard = new Scenes.WizardScene<any>('SHOW_RATINGS', async (ctx) => {
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  let headerList;
  try {
    headerList = JSON.parse(JSON.stringify(ctx.session.auth));
  } catch {
    await ctx.reply(
      'Чтобы получить статистику, нужно сначала войти 🚪 :)',
      Markup.inlineKeyboard([Markup.button.callback('Войти 🚪', 'signinup')], { columns: 2 })
    );
    return;
  }
  let res;
  try {
    res = await axios.get('http://localhost:3300/user/ratings', {
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    const { data: user_ratings } = res.data;
    const ids = [];
    if (user_ratings.length === 0) {
      const { message_id: errid } = await ctx.reply(`Не найдено ни одного прохождения квиза`);
      ids.push(errid);
    }
    for (const rate of user_ratings.ratings) {
      const { message_id: msgid } = await ctx.reply(
        `Ник пользователя: ${rate.nick} \n\n` +
          `Рейтинг: ${rate.rating} \n\n` +
          `Квиз: \n\n` +
          `\t`.repeat(4) +
          `ID: ${rate.quiz.id} \n\n` +
          `\t`.repeat(4) +
          `Наименование: ${rate.quiz.name} \n\n` +
          `\t`.repeat(4) +
          `Описание: ${rate.quiz.descr} \n\n`
      );
      ids.push(msgid);
    }
    const { message_id: sum } = await ctx.reply(`Суммарное число баллов: ${user_ratings.summary}`);
    ids.push(sum);
    const { message_id: dialogid } = await ctx.reply('Действия с профилем 👨‍', getProfileActionsKeyboard());
    ctx.session.last_bot_message_id = dialogid;
    Object.assign(ctx.session, { messageCounter: ids });
  } catch (error: any) {
    ctx.reply(`Что то пошло не так, ошибка ${error.data ? error.data.message : error.message}`);
  }
  await ctx.scene.leave();
});
