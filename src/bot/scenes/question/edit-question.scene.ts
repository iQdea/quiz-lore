import { Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const editQuestionWizard = new Scenes.WizardScene<any>(
  'EDIT_QUESTION',
  async (ctx) => {
    ctx.reply('Enter question id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { edit: { questionId: ctx.message.text } });
    ctx.reply('Enter property to change');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.edit, { propertyName: ctx.message.text });
    ctx.reply('Enter new value');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state.edit, { propertyValue: ctx.message.text });
    const changes = {} as Dictionary;
    changes[ctx.wizard.state.edit.propertyName] = ctx.wizard.state.edit.propertyValue;
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    const res = await axios.patch(
      `http://localhost:3300/question/${ctx.wizard.state.edit.questionId}`,
      { ...changes },
      {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      }
    );
    const { data: question } = res.data;
    ctx.reply(`ID: ${question.id} \n\n` + `Вопрос: ${question.question} \n\n` + `ID квиза: ${question.quizId} \n\n`);
    await ctx.scene.leave();
  }
);
