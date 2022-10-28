import { Markup, Scenes } from 'telegraf';
import axios from 'axios';

export const createOptionsWizard = new Scenes.WizardScene<any>(
  'CREATE_OPTIONS',
  async (ctx) => {
    Object.assign(ctx.session, { options: [] });
    ctx.reply('Enter question id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.session, { optionContext: { questionId: ctx.message.text }, previousSection: 'OPTIONS' });
    ctx.reply(
      'Click Add option to create new option',
      Markup.inlineKeyboard([
        Markup.button.callback(`Add option`, `add_option`),
        Markup.button.callback('Cancel', 'cancel')
      ])
    );
    await ctx.scene.leave();
  }
);

export const addOptionWizard = new Scenes.WizardScene<any>(
  'ADD_OPTION',
  async (ctx) => {
    ctx.reply('Enter option text');
    await ctx.wizard.next();
  },
  async (ctx) => {
    Object.assign(ctx.wizard.state, { option: { text: ctx.message.text } });
    ctx.reply('Is this option answer? Type true if it is.');
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.options.push({
      text: ctx.wizard.state.option.text,
      isAnswer: ctx.message.text === 'true',
      questionId: ctx.session.optionContext.questionId
    });
    ctx.reply('Successfully added, if you want to add more options type yes, if not type no');
    await ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text.toLowerCase() === 'yes') {
      await ctx.scene.enter('ADD_OPTION');
    } else if (ctx.message.text.toLowerCase() === 'no') {
      const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
      const res = await axios.post(
        `http://localhost:3300/option`,
        {
          options: ctx.session.options
        },
        {
          headers: {
            Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
          }
        }
      );
      const { data: options } = res.data;
      ctx.reply(JSON.stringify(options));
      await ctx.scene.leave();
    }
  }
);
