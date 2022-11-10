import { Scenes } from 'telegraf';
import axios from 'axios';
import { getQuizActionsKeyboard } from '../index';

let headerList: any;
export const createQuizWizard = new Scenes.WizardScene<any>(
  'CREATE_QUIZ',
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
      ctx.reply('Чтобы создать квиз, нужно сначала войти :)');
      return;
    }
    const { message_id: msgid } = await ctx.reply('Enter quiz name');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { quiz: { displayName: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply('Enter quiz description');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state.quiz, { description: ctx.message.text });
    ctx.deleteMessage(ctx.message.message_id);
    let res;
    try {
      res = await axios.post('http://localhost:3300/quiz', ctx.wizard.state.quiz, {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      });
      const { data: quiz } = res.data;
      const { message_id: msgid } = await ctx.reply(
        `ID: ${quiz.id} \n\n` + `Название: ${quiz.displayName} \n\n` + `Описание: ${quiz.description} \n\n`
      );
      const { message_id: dialogid } = await ctx.reply('Действия с квизом', getQuizActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: [msgid] });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
