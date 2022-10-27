import { Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const signoutWizard = new Scenes.WizardScene<any>('SIGNOUT', async (ctx) => {
  const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
  const res = await axios.post(
    'http://localhost:3300/auth/signout',
    {},
    {
      headers: {
        Cookie: `sIdRefreshToken=${headerList.sIdRefreshToken}; sRefreshToken=${headerList.sAccessToken}`
      }
    }
  );
  const data = res.data;
  if (data.status === 'OK') {
    const cookiesList = {} as Dictionary;
    Object.assign(ctx.session, { auth: cookiesList });
  }
  ctx.reply('Successfully');
  await ctx.scene.leave();
});
