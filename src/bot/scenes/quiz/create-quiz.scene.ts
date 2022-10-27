import { Scenes } from 'telegraf';
import axios from 'axios';

export const createQuizWizard = new Scenes.WizardScene<any>(
  'CREATE_QUIZ',
  async (ctx) => {
    ctx.reply('Enter quiz name');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { quiz: { displayName: ctx.message.text } });
    ctx.reply('Enter quiz description');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.quiz, { description: ctx.message.text });
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    const res = await axios.post('http://localhost:3300/quiz', ctx.wizard.state.quiz, {
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    const { data: quiz } = res.data;
    ctx.reply(`ID: ${quiz.id} \n\n` + `Название: ${quiz.displayName} \n\n` + `Описание: ${quiz.description} \n\n`);
    await ctx.scene.leave();
  }
);
