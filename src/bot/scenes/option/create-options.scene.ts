import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import { getOptionsActionsKeyboard } from '../index';

let headerList: any;
export const createOptionsWizard = new Scenes.WizardScene<any>(
  'CREATE_OPTIONS',
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
      ctx.reply('Чтобы создать опции, нужно сначала войти 🚪 :)');
      return;
    }
    Object.assign(ctx.session, { options: [] });
    const { message_id: msgid } = await ctx.reply('Введите id вопроса');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.session, { optionContext: { questionId: ctx.message.text }, previousSection: 'OPTIONS' });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply(
      'Нажмите добавить опцию',
      Markup.inlineKeyboard([
        Markup.button.callback(`Добавить опцию`, `add_option`),
        Markup.button.callback('Отмена 🚫', 'cancel')
      ])
    );
    ctx.session.last_bot_message_id = msgid;
    Object.assign(ctx.session, { startId: msgid });
    await ctx.scene.leave();
  }
);

export const addOptionWizard = new Scenes.WizardScene<any>(
  'ADD_OPTION',
  async (ctx) => {
    if (ctx.scene.state.startId) {
      ctx.deleteMessage(ctx.scene.state.startId);
      ctx.session.startId = undefined;
    }
    try {
      headerList = JSON.parse(JSON.stringify(ctx.session.auth));
    } catch {
      ctx.reply('Чтобы создать опции, нужно сначала войти 🚪 :)');
      return;
    }
    const { message_id: msgid } = await ctx.reply('Введите текст опции');
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    Object.assign(ctx.wizard.state, { option: { text: ctx.message.text } });
    ctx.deleteMessage(ctx.message.message_id);
    const { message_id: msgid } = await ctx.reply(
      'Является ли опция ответом на вопрос?',
      Markup.inlineKeyboard([Markup.button.callback('✔Да', 'true'), Markup.button.callback('❌Нет', 'false')])
    );
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    ctx.session.options.push({
      text: ctx.wizard.state.option.text,
      isAnswer: ctx.update.callback_query.data === 'true',
      questionId: ctx.session.optionContext.questionId
    });
    const { message_id: msgid } = await ctx.reply(
      'Успешно записано, хотите ли вы добавить еще опции?',
      Markup.inlineKeyboard([Markup.button.callback('✔Да', 'yes'), Markup.button.callback('❌Нет', 'no')])
    );
    ctx.session.last_bot_message_id = msgid;
    await ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
    if (ctx.update.callback_query.data === 'yes') {
      await ctx.scene.enter('ADD_OPTION', ctx.session);
    } else if (ctx.update.callback_query.data === 'no') {
      let res;
      try {
        res = await axios.post(
          `http://localhost:3300/option`,
          {
            options: ctx.session.options
          },
          {
            headers: {
              Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
            }
          }
        );
        const { data: options } = res.data;
        const ids = [];
        if (options.length === 0) {
          const { message_id: errid } = await ctx.reply(`Не найдено ни одной опции`);
          ids.push(errid);
        }
        for (const item of options) {
          const { message_id: msgid } = await ctx.reply(
            `ID: ${item.id} \n\n` +
              `Текст: ${item.text} \n\n` +
              `Ответ: ${item.isAnswer ? '✔Да' : '❌Нет'} \n\n` +
              `ID вопроса: ${item.questionId} \n\n`
          );
          ids.push(msgid);
        }
        const { message_id: dialogid } = await ctx.reply('Действия с опциями 📝', getOptionsActionsKeyboard());
        ctx.session.last_bot_message_id = dialogid;
        Object.assign(ctx.session, { messageCounter: ids });
      } catch (error: any) {
        ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
      }
      await ctx.scene.leave();
    }
  }
);
