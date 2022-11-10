import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { Dictionary } from '../../interfaces/interface';

export const phoneLoginWizard = new Scenes.WizardScene<any>(
  'PHONE_LOGIN',
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    ctx.deleteMessage(ctx.message.message_id);
    try {
      ctx.session.contactData = { phone: ctx.wizard.state.phone };
      const res = await axios.post('http://localhost:3300/auth/signinup/code', {
        phoneNumber: ctx.session.contactData.phone.startsWith('+')
          ? ctx.session.contactData.phone
          : '+' + ctx.session.contactData.phone
      });
      const data = res.data;
      const { deviceId, preAuthSessionId } = data;
      Object.assign(ctx.session, { preauthData: { deviceId, preAuthSessionId } });
      const { message_id: msgid } = await ctx.reply(
        `На указанный номер телефона (${ctx.session.contactData.phone}) выслан 6-значный код, введите его ниже`
      );
      ctx.session.last_bot_message_id = msgid;
    } catch (error: any) {
      ctx.reply(`Что-то пошло не так, ошибка ${error.message}`);
      await ctx.scene.leave();
    }
    await ctx.wizard.next();
  },
  async (ctx) => {
    try {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
      const otp = ctx.message.text;
      ctx.deleteMessage(ctx.message.message_id);
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
        const { message_id: msgid } = await ctx.reply(
          `Поздравляем, вы успешно вошли в систему. Нажмите 'Далее' чтобы продолжить`,
          Markup.inlineKeyboard([Markup.button.callback('Далее', 'start_work')])
        );
        ctx.session.last_bot_message_id = msgid;
      } else {
        ctx.reply(`Что-то пошло не так, ошибка ${data.status}`);
      }
    } catch (error: any) {
      ctx.reply(`Что-то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
