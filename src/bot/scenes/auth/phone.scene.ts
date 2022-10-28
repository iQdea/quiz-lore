import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const phoneLoginWizard = new Scenes.WizardScene<any>(
  'PHONE_LOGIN',
  async (ctx) => {
    ctx.session.contactData = { phone: ctx.wizard.state.phone };
    const res = await axios.post('http://localhost:3300/auth/signinup/code', {
      phoneNumber: ctx.session.contactData.phone.startsWith('+')
        ? ctx.session.contactData.phone
        : '+' + ctx.session.contactData.phone
    });
    const data = res.data;
    const { deviceId, preAuthSessionId } = data;
    Object.assign(ctx.session, { preauthData: { deviceId, preAuthSessionId } });
    ctx.reply(`Your phone is ${ctx.session.contactData.phone}, send your otp`);
    await ctx.wizard.next();
  },
  async (ctx) => {
    const otp = ctx.message.text;
    const res = await axios.post('http://localhost:3300/auth/signinup/code/consume', {
      ...ctx.session.preauthData,
      userInputCode: otp
    });
    const data = res.data;
    if (data.status === 'OK') {
      const cookies = String(res.headers['set-cookie']).split('x,');
      const cookiesList = {} as Dictionary;
      for (const cookie of cookies) {
        const value = cookie.split(';')[0];
        cookiesList[value.split('=')[0]] = value.split('=')[1];
      }
      Object.assign(ctx.session, { auth: { ...cookiesList } });
      ctx.reply('Successfully', Markup.inlineKeyboard([Markup.button.callback('Start work', 'start_work')]));
    }
    await ctx.scene.leave();
  }
);
