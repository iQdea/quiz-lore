import { Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const emailLoginWizard = new Scenes.WizardScene<any>(
  'EMAIL_PASSWORD_LOGIN',
  (ctx) => {
    ctx.reply('Enter your email');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.contactData.email = ctx.message.text;
    ctx.reply('Enter your password');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.contactData.password = ctx.message.text;
    const res = await axios.post('http://localhost:3300/auth/signup', {
      formFields: [
        {
          id: 'email',
          value: ctx.session.contactData.email
        },
        {
          id: 'password',
          value: ctx.session.contactData.password
        }
      ]
    });
    const data = res.data;
    if (data.status === 'OK') {
      const cookies = String(res.headers['set-cookie']).split('x,');
      const cookiesList = {} as Dictionary;
      for (const cookie of cookies) {
        const value = cookie.split(';')[0];
        cookiesList[value.split('=')[0]] = value.split('=')[1];
      }
      Object.assign(ctx.session.auth, cookiesList);
      await ctx.reply('Successfully');
    } else {
      const res = await axios.post('http://localhost:3300/auth/signin', {
        formFields: [
          {
            id: 'email',
            value: ctx.session.contactData.email
          },
          {
            id: 'password',
            value: ctx.session.contactData.password
          }
        ]
      });
      const data = res.data;
      if (data.status === 'OK') {
        const cookies = String(res.headers['set-cookie']).split('x,');
        const cookiesList = {} as Dictionary;
        for (const cookie of cookies) {
          const value = cookie.split(';')[0];
          cookiesList[value.split('=')[0]] = value.split('=')[1];
        }
        Object.assign(ctx.session.auth, cookiesList);
        await ctx.reply('Successfully');
      }
    }
    await ctx.scene.leave();
  }
);
