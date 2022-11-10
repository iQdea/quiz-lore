import { Scenes } from 'telegraf';
import axios from 'axios';
import { getOptionsActionsKeyboard } from '../index';

export const getOptionsCollectionWizard = new Scenes.WizardScene<any>(
  'GET_OPTIONS_COLLECTION',
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
    const { message_id: msgid } = await ctx.reply('Введите id вопроса');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    let res;
    try {
      res = await axios.get(`http://localhost:3300/option/${ctx.message.text}`);
      ctx.deleteMessage(ctx.message.message_id);
      const { data: options_collection } = res.data;
      if (options_collection.length === 0) {
        ctx.reply('There are no options');
      }
      const ids = [];
      if (options_collection.length === 0) {
        const { message_id: errid } = await ctx.reply(`Не найдено ни одной опции`);
        ids.push(errid);
      }
      for (const item of options_collection) {
        const { message_id: msgid } = await ctx.reply(
          `ID: ${item.id} \n\n` +
            `Текст: ${item.text} \n\n` +
            `Ответ: ${item.isAnswer ? 'Да' : 'Нет'} \n\n` +
            `ID вопроса: ${item.questionId} \n\n`
        );
        ids.push(msgid);
      }
      const { message_id: dialogid } = await ctx.reply('Действия с опциями', getOptionsActionsKeyboard());
      ctx.session.last_bot_message_id = dialogid;
      Object.assign(ctx.session, { messageCounter: ids });
    } catch (error: any) {
      ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
    }
    await ctx.scene.leave();
  }
);
