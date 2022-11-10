import { Scenes } from 'telegraf';
import axios from 'axios';
import { getOptionsActionsKeyboard } from '../index';

let headerList: any;
export const deleteOptionWizard = new Scenes.WizardScene<any>(
  'DELETE_OPTION',
  async (ctx) => {
    if (ctx.session.messageCounter) {
      for (const i of ctx.session.messageCounter) {
        ctx.deleteMessage(i);
      }
      ctx.session.messageCounter = undefined;
    }
    if (ctx.session.last_bot_message_id) {
      ctx.deleteMessage(ctx.session.last_bot_message_id);
    }
    try {
      headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    } catch {
      ctx.reply('Чтобы удалить опцию, нужно сначала войти 🚪 :)');
      return;
    }
    const { message_id: msgid } = await ctx.reply('Введите id опции');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    try {
      await axios.delete(`http://localhost:3300/option/${ctx.message.text}`, {
        headers: {
          Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
        }
      });
      ctx.deleteMessage(ctx.message.message_id);
      const { message_id: msgid } = await ctx.reply('Успешно удалено');
      const { message_id: dialogid } = await ctx.reply('Действия с опциями 📝', getOptionsActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: [msgid] });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
