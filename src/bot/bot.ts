import { Context, Markup, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import axios from 'axios';
import * as qs from 'querystring';

interface Dic {
  [key: string]: string;
}
export interface ContextBot extends Context {
  session: {
    [key: string]: string;
  };
}

export async function bot() {
  const token = '5570162323:AAFjwlKHHrbIOvCcqW0J62JQ7Q726Yg1FpA';
  const sessions = new LocalSession({ database: 'session_db.json' });
  const bot = new Telegraf<ContextBot>(token);
  bot.use(sessions.middleware());
  bot.start(async (ctx) => {
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      'Which way you want to continue with?',
      Markup.keyboard([
        Markup.button.contactRequest('Share Phone Number'),
        Markup.button.callback('Email/Password', 'email'),
        Markup.button.callback('Profile', 'profile')
      ])
    );
  });
  bot.on('contact', async (ctx) => {
    const contact = ctx.message.contact.phone_number;
    const res = await axios.post('http://localhost:3300/auth/signinup/code', {
      phoneNumber: '+' + contact
    });
    const data = res.data;
    const { deviceId, preAuthSessionId } = data;
    Object.assign(ctx.session, { deviceId, preAuthSessionId, type: 'phone_login' });
    await ctx.reply(
      `Your phone is ${contact}, send your otp`,
      Markup.inlineKeyboard([Markup.button.callback('Login', 'otp')])
    );
  });

  bot.hears('Email/Password', async (ctx) => {
    Object.assign(ctx.session, { type: 'email_login' });
    await ctx.reply('Send your email and password in format - email :: password');
  });

  bot.hears('Profile', async (ctx) => {
    ctx.reply(
      'Actions with profile',
      Markup.keyboard([
        Markup.button.callback('Get Profile', 'get_profile'),
        Markup.button.callback('Edit Profile', 'edit_profile')
      ])
    );
  });

  bot.hears('Get Profile', async (ctx) => {
    const headerList = JSON.parse(JSON.stringify(ctx.session));
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
  });

  bot.hears('Edit Profile', async (ctx) => {
    Object.assign(ctx.session, { type: 'edit' });
    await ctx.reply('Введите данные для изменения в формате - Что_изменить :: значение');
  });

  bot.action('otp', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Send your otp');
  });

  bot.on('text', async (ctx: any) => {
    const type = JSON.parse(JSON.stringify(ctx.session)).type;
    switch (type) {
      case 'phone_login': {
        const otp = ctx.message.text;
        const res = await axios.post('http://localhost:3300/auth/signinup/code/consume', {
          ...ctx.session,
          userInputCode: otp
        });
        const data = res.data;
        if (data.status === 'OK') {
          const cookies = String(res.headers['set-cookie']).split('x,');
          const cookiesList = {} as Dic;
          for (const cookie of cookies) {
            const value = cookie.split(';')[0];
            cookiesList[value.split('=')[0]] = qs.unescape(value.split('=')[1]);
          }
          Object.assign(ctx.session, cookiesList);
          await ctx.reply('Successfully');
        }

        break;
      }
      case 'email_login': {
        const message = ctx.message.text;
        const [email, password] = message.split(' :: ');
        const res = await axios.post('http://localhost:3300/auth/signup', {
          formFields: [
            {
              id: 'email',
              value: email
            },
            {
              id: 'password',
              value: password
            }
          ]
        });
        const data = res.data;
        if (data.status === 'OK') {
          const cookies = String(res.headers['set-cookie']).split('x,');
          const cookiesList = {} as Dic;
          for (const cookie of cookies) {
            const value = cookie.split(';')[0];
            cookiesList[value.split('=')[0]] = value.split('=')[1];
          }
          Object.assign(ctx.session, cookiesList);
          await ctx.reply('Successfully');
        } else {
          const res = await axios.post('http://localhost:3300/auth/signin', {
            formFields: [
              {
                id: 'email',
                value: email
              },
              {
                id: 'password',
                value: password
              }
            ]
          });
          const data = res.data;
          if (data.status === 'OK') {
            const cookies = String(res.headers['set-cookie']).split('x,');
            const cookiesList = {} as Dic;
            for (const cookie of cookies) {
              const value = cookie.split(';')[0];
              cookiesList[value.split('=')[0]] = value.split('=')[1];
            }
            Object.assign(ctx.session, cookiesList);
            await ctx.reply('Successfully');
          }
        }

        break;
      }
      case 'edit': {
        const dic = {} as Dic;
        const [key, value] = ctx.message.text.split(' :: ');
        dic[key] = value;
        const headerList = JSON.parse(JSON.stringify(ctx.session));
        const res = await axios.patch(
          'http://localhost:3300/user',
          { ...dic },
          {
            headers: {
              Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
            }
          }
        );
        const {
          data: { user }
        } = res.data;
        ctx.reply(
          `ID: ${user.id} \n\n` +
            `Имя: ${user.firstName} \n\n` +
            `Фамилия: ${user.lastName} \n\n` +
            `День рождения: ${user.birthDate} \n\n`
        );

        break;
      }
      // No default
    }
  });

  bot.launch();
}
