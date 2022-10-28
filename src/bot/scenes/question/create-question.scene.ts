import { Scenes } from 'telegraf';
import axios from 'axios';

export const createQuestionWizard = new Scenes.WizardScene<any>(
  'CREATE_QUESTION',
  async (ctx) => {
    ctx.reply('Enter question');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { questionObject: { question: ctx.message.text } });
    ctx.reply('Enter quiz id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.questionObject, { quizId: ctx.message.text });
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    const res = await axios.post('http://localhost:3300/question', ctx.wizard.state.questionObject, {
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    const { data: question } = res.data;
    ctx.reply(`ID: ${question.id} \n\n` + `Вопрос: ${question.question} \n\n` + `ID квиза: ${question.quizId} \n\n`);
    await ctx.scene.leave();
  }
);
