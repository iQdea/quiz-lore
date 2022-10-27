import { Scenes } from 'telegraf';
import axios from 'axios';

export const getQuizWizard = new Scenes.WizardScene<any>(
  'GET_QUIZ',
  async (ctx) => {
    ctx.reply('Enter quiz id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    const res = await axios.get(`http://localhost:3300/quiz/${ctx.message.text}`);
    const { data: quiz } = res.data;
    const json = JSON.stringify(quiz);
    ctx.reply(json);
    await ctx.scene.leave();
  }
);
