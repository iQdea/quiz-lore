import { Scenes } from 'telegraf';
import axios from 'axios';

export const deleteOptionWizard = new Scenes.WizardScene<any>(
  'DELETE_OPTION',
  async (ctx) => {
    ctx.reply('Enter option id');
    await ctx.wizard.next();
  },
  async (ctx) => {
    const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    await axios.delete(`http://localhost:3300/option/${ctx.message.text}`, {
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    ctx.reply('Successfully');
    await ctx.scene.leave();
  }
);
