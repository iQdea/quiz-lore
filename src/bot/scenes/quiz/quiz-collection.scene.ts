import { Scenes } from 'telegraf';
import axios from 'axios';

export const getQuizUserCollectionWizard = new Scenes.WizardScene<any>('GET_QUIZ_USER_COLLECTION', async (ctx) => {
  const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
  const res = await axios.get('http://localhost:3300/quiz/user_collection', {
    headers: {
      Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
    }
  });
  const { data: quiz_collection } = res.data;
  if (quiz_collection.length === 0) {
    ctx.reply(`There are no quiz's`);
  }
  for (const quiz of quiz_collection) {
    ctx.reply(`ID: ${quiz.id} \n\n` + `Название: ${quiz.displayName} \n\n` + `Описание: ${quiz.description} \n\n`);
  }
  await ctx.scene.leave();
});
