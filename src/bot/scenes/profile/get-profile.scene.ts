import { Scenes } from 'telegraf';
import axios from 'axios';

export const getProfileWizard = new Scenes.WizardScene<any>('GET_PROFILE', async (ctx) => {
  const headerList = JSON.parse(JSON.stringify(ctx.session.auth));
  const res = await axios.get('http://localhost:3300/user', {
    headers: {
      Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
    }
  });
  const {
    data: { user }
  } = res.data;
  ctx.reply(
    `ID: ${user.id} \n\n` +
      `Имя: ${user.firstName} \n\n` +
      `Фамилия: ${user.lastName} \n\n` +
      `День рождения: ${user.birthDate} \n\n`
  );
  await ctx.scene.leave();
});
