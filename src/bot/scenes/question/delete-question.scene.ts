import { Scenes } from 'telegraf';
import axios from 'axios';

export const deleteQuestionWizard = new Scenes.WizardScene<any>(
  'DELETE_QUESTION',
  async (ctx) => {
    ctx.reply('Enter question id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { edit: { questionId: ctx.message.text } });
    ctx.reply('Enter quiz id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.edit, { quizId: ctx.message.text });
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    await axios.delete(`http://localhost:3300/question`, {
      params: {
        question_id: ctx.wizard.state.edit.questionId,
        quiz_id: ctx.wizard.state.edit.quizId
      },
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    ctx.reply('Successfully');
    await ctx.scene.leave();
  }
);
