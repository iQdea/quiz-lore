import { Scenes } from 'telegraf';
import axios from 'axios';

export const getQuizHistoryWizard = new Scenes.WizardScene<any>('GET_HISTORY', async (ctx) => {
  const res = await axios.get('http://localhost:3300/quiz/history');
  const { data: quiz_history } = res.data;
  const json = JSON.stringify(quiz_history);
  ctx.reply(json);
  await ctx.scene.leave();
});
