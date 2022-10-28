import { Scenes } from 'telegraf';
import axios from 'axios';

export const getOptionsCollectionWizard = new Scenes.WizardScene<any>(
  'GET_OPTIONS_COLLECTION',
  async (ctx) => {
    ctx.reply('Enter question id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    const res = await axios.get(`http://localhost:3300/option/${ctx.message.text}`);
    const { data: options_collection } = res.data;
    for (const item of options_collection) {
      ctx.reply(
        `ID: ${item.id} \n\n` +
          `Текст: ${item.text} \n\n` +
          `Ответ: ${item.isAnswer ? 'Да' : 'Нет'} \n\n` +
          `ID вопроса: ${item.questionId} \n\n`
      );
    }
    await ctx.scene.leave();
  }
);
