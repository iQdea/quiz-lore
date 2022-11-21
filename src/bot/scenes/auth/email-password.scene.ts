import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const emailLoginWizard = new Scenes.WizardScene<any>(
  'EMAIL_PASSWORD_LOGIN',
  async (ctx) => {
    if (ctx.session.last_bot_message_id) {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
    }
    ctx.session.contactData = {};
    const { message_id: msgid } = await ctx.reply('Введите ваш адрес электронной почты');
    ctx.session.last_bot_message_id = msgid;
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.session.last_bot_message_id) {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
    }
    Object.assign(ctx.session.contactData, { email: ctx.message.text });
    ctx.deleteMessage(ctx.message.id);
    const { message_id: msgid } = await ctx.reply('Введите пароль');
    ctx.session.last_bot_message_id = msgid;
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.session.last_bot_message_id) {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
    }
    Object.assign(ctx.session.contactData, { password: ctx.message.text });
    ctx.deleteMessage(ctx.message.id);
    try {
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
        Object.assign(ctx.session, { auth: cookiesList });
        const { message_id: msgid } = await ctx.reply(
          `Поздравляем, вы успешно вошли в систему. Нажмите 'Далее' чтобы продолжить`,
          Markup.inlineKeyboard([Markup.button.callback('Далее', 'start_work')])
        );
        ctx.session.last_bot_message_id = msgid;
      } else {
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
          Object.assign(ctx.session, { auth: cookiesList });
          const { message_id: msgid } = await ctx.reply(
            `Внимание: пользователь не существует.` +
              `Успешно зарегистрирован новый пользователь в системе. Нажмите 'Далее' чтобы продолжить`,
            Markup.inlineKeyboard([Markup.button.callback('Далее', 'start_work')])
          );
          ctx.session.last_bot_message_id = msgid;
        } else {
          ctx.reply(`Что-то пошло не так, ошибка ${data.status}`);
        }
      }
    } catch (error: any) {
      ctx.reply(`Что-то пошло не так, ошибка ${error.data ? error.data.message : error.message}`);
    }
    await ctx.scene.leave();
  }
);
