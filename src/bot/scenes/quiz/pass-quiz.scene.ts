import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { getQuizActionsKeyboard } from '../index';

let headerList: any;
export const connectQuizWizard = new Scenes.WizardScene<any>(
  'CONNECT_QUIZ',
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
      ctx.reply('Чтобы присоединиться к квизу, нужно сначала войти 🚪 :)');
      return;
    }
    Object.assign(ctx.session, { quizResult: 0 });
    const { message_id: msgid } = await ctx.reply('Введите код доступа');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { participant: { code: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply('Введите ник для квиза');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state.participant, { nick: ctx.message.text });
    ctx.deleteMessage(ctx.message.message_id);
    let res;
    try {
      res = await axios.post(`http://localhost:3300/participant/connect`, ctx.wizard.state.participant, {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      });
      const { data: participant } = res.data;
      const { message_id: msgid } = await ctx.reply(`ID участника: ${participant.id}`);
      Object.assign(ctx.session, { participant: { id: participant.id } });
      Object.assign(ctx.session, { messageCounter: [msgid] });
      const { message_id: sysmsgid } = await ctx.reply(
        'Нажмите Начать, чтобы продолжить',
        Markup.inlineKeyboard([
          Markup.button.callback(`Начать`, `start_quiz`),
          Markup.button.callback('Отмена 🚫', 'cancel')
        ])
      );
      ctx.session.last_bot_message_id = sysmsgid;
      Object.assign(ctx.session, { startedQuizId: participant.quizId });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.data.message}`);
    }
    await ctx.scene.leave();
  }
);

export const startQuizWizard = new Scenes.WizardScene<any>('START_QUIZ', async (ctx) => {
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
    ctx.reply('Чтобы пройти квиз, нужно сначала войти 🚪 :)');
    return;
  }
  const questions = await axios.get(`http://localhost:3300/question/${ctx.session.startedQuizId}`, {
    headers: {
      Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
    }
  });
  const { data: questions_array } = questions.data;
  Object.assign(ctx.session, { quizQuestions: questions_array });
  const { message_id: msgid } = await ctx.reply(
    'Вопросы загружены',
    Markup.inlineKeyboard([
      Markup.button.callback(`Продолжить`, `answer_question`),
      Markup.button.callback('Отмена 🚫', 'cancel')
    ])
  );
  ctx.session.last_bot_message_id = msgid;
  await ctx.scene.leave();
});

export const answerQuestionWizard = new Scenes.WizardScene<any>(
  'ANSWER_QUESTION',
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
    const data = ctx.session.quizQuestions.pop();
    if (data) {
      const markups = [];
      const options = await axios.get(`http://localhost:3300/option/${data.id}`, {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      });
      const { data: options_array } = options.data;
      for (const option of options_array) {
        markups.push(Markup.button.callback(option.text, `${option.isAnswer}`));
      }
      const { message_id: question_message } = await ctx.reply(data.question, Markup.inlineKeyboard(markups));
      ctx.session.last_bot_message_id = question_message;
      await ctx.wizard.next();
    }
  },
  async (ctx) => {
    const isAnswer = ctx.update.callback_query.data === 'true';
    if (ctx.session.last_bot_message_id) {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
    }
    if (isAnswer) {
      ctx.session.quizResult += 10;
      const { message_id: sys_answer_message } = await ctx.reply('Правильно, вы заработали 10 баллов');
      ctx.session.last_bot_message_id = sys_answer_message;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } else {
      const { message_id: sys_answer_message } = await ctx.reply('Неверно, вы заработали 0 баллов');
      ctx.session.last_bot_message_id = sys_answer_message;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    if (ctx.session.quizQuestions.length === 0) {
      const { message_id: sys_next_message } = await ctx.reply(
        `Квиз окончен. Вы ответили верно на ${ctx.session.quizResult / 10} вопросов и заработали ${
          ctx.session.quizResult
        } баллов`
      );
      await axios.post(
        `http://localhost:3300/quiz/ratings`,
        {
          rating: ctx.session.quizResult,
          participantId: ctx.session.participant.id
        },
        {
          headers: {
            Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
          }
        }
      );
      Object.assign(ctx.session, { messageCounter: [sys_next_message] });
      Object.assign(ctx.session, { previousSection: 'MAIN' });
      const { message_id: dialogid } = await ctx.reply('Действия с квизом 🔍', getQuizActionsKeyboard());
      ctx.session.messageCounter.push(dialogid);
      await ctx.scene.leave();
    } else {
      const { message_id: sys_next_message } = await ctx.reply('Следующий вопрос: ');
      Object.assign(ctx.session, { messageCounter: [sys_next_message] });
      await ctx.scene.enter('ANSWER_QUESTION', ctx.session);
    }
  }
);
