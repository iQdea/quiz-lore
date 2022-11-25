import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { getQuizActionsKeyboard } from '../index';
import appConfig from '../../../app.config';

let headerList: any;
export const getQuizUserCollectionWizard = new Scenes.WizardScene<any>('GET_QUIZ_USER_COLLECTION', async (ctx) => {
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
      'Чтобы получить коллекцию квизов, нужно сначала войти 🚪 :)',
      Markup.inlineKeyboard([Markup.button.callback('Войти 🚪', 'signinup')], { columns: 2 })
    );
    return;
  }

  try {
    const res = await axios.get(`${appConfig().host}/quiz/user_collection`, {
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    const { data: quiz_collection } = res.data;
    const ids = [];
    if (quiz_collection.length === 0) {
      const { message_id: errid } = await ctx.reply(`Не найдено ни одного квиза`);
      ids.push(errid);
    }
    for (const quiz of quiz_collection) {
      const { message_id: msgid } = await ctx.reply(
        `ID: ${quiz.id} \n\n` + `Название: ${quiz.displayName} \n\n` + `Описание: ${quiz.description} \n\n`
      );
      ids.push(msgid);
    }
    const { message_id: dialogid } = await ctx.reply('Действия с квизом 🔍', getQuizActionsKeyboard());
    ctx.session.last_bot_message_id = dialogid;
    Object.assign(ctx.session, { messageCounter: ids });
  } catch (error: any) {
    ctx.reply(`Что то пошло не так, ошибка ${error.data ? error.data.message : error.message}`);
  }

  await ctx.scene.leave();
});
