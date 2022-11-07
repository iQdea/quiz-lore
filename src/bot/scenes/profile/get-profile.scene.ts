import { Scenes } from 'telegraf';
import axios from 'axios';
import { getProfileActionsKeyboard } from '..';

export const getProfileWizard = new Scenes.WizardScene<any>('GET_PROFILE', async (ctx) => {
  if (ctx.session.messageMark && ctx.session.messageMark === ctx.session.last_bot_message_id) {
    ctx.deleteMessage();
  }
  ctx.deleteMessage(ctx.session.last_bot_message_id);
  let headerList;
  try {
    headerList = JSON.parse(JSON.stringify(ctx.session.auth));
  } catch {
    ctx.reply('Чтобы получить профиль, нужно сначала войти :)');
  }
  const res = await axios.get('http://localhost:3300/user', {
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
  ctx.session.last_bot_message_id = msgid;
  ctx.reply('Действия с профилем', getProfileActionsKeyboard());
  Object.assign(ctx.session, { messageMark: msgid });
  await ctx.scene.leave();
});
