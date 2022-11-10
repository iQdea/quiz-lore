import { Scenes } from 'telegraf';
import axios from 'axios';
import { getProfileActionsKeyboard } from '..';

export const getProfileWizard = new Scenes.WizardScene<any>('GET_PROFILE', async (ctx) => {
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  let headerList;
  try {
    headerList = JSON.parse(JSON.stringify(ctx.session.auth));
  } catch {
    ctx.reply('Чтобы получить профиль, нужно сначала войти :)');
    return;
  }
  let res;
  try {
    res = await axios.get('http://localhost:3300/user', {
      headers: {
        Cookie: `sAccessToken=${headerList.sAccessToken}; sIdRefreshToken=${headerList.sIdRefreshToken}`
      }
    });
    const {
      data: { user }
    } = res.data;
    const { message_id: msgid } = await ctx.reply(
      `ID: ${user.id} \n\n` +
        `Имя: ${user.firstName} \n\n` +
        `Фамилия: ${user.lastName} \n\n` +
        `День рождения: ${user.birthDate} \n\n`
    );
    const { message_id: dialogid } = await ctx.reply('Действия с профилем', getProfileActionsKeyboard());
    ctx.session.last_bot_message_id = dialogid;
    Object.assign(ctx.session, { messageCounter: [msgid] });
  } catch (error: any) {
    ctx.reply(`Что то пошло не так, ошибка ${error.message}`);
  }
  await ctx.scene.leave();
});
