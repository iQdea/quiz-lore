import { Scenes } from 'telegraf';
import axios from 'axios';

export const getQuizHistoryWizard = new Scenes.WizardScene<any>('GET_HISTORY', async (ctx) => {
  const res = await axios.get('http://localhost:3300/quiz/history');
  const { data: quiz_history } = res.data;
  if (quiz_history.length === 0) {
    ctx.reply(`There are no quiz's`);
  }
  const json = JSON.stringify(quiz_history);
  ctx.reply(json);
  await ctx.scene.leave();
});
