import { Scenes } from 'telegraf';
import axios from 'axios';

export const getQuestionsCollectionWizard = new Scenes.WizardScene<any>(
  'GET_QUESTIONS_COLLECTION',
  async (ctx) => {
    ctx.reply('Enter quiz id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    const res = await axios.get(`http://localhost:3300/question/${ctx.message.text}`);
    const { data: questions_collection } = res.data;
    for (const item of questions_collection) {
      ctx.reply(`ID: ${item.id} \n\n` + `Вопрос: ${item.question} \n\n` + `ID квиза: ${item.quizId} \n\n`);
    }
    await ctx.scene.leave();
  }
);
