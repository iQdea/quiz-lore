import { Scenes, Telegraf, session, Markup } from 'telegraf';
import { emailLoginWizard, phoneLoginWizard, getProfileWizard, editProfileWizard } from './scenes';
import appConfig from '../app.config';

export async function bot() {
  const bot = new Telegraf<Scenes.WizardContext>(appConfig().bot.token);
  const stage = new Scenes.Stage([emailLoginWizard, phoneLoginWizard, getProfileWizard, editProfileWizard]);
  bot.use(session());
  bot.use(stage.middleware());
  bot.start(async (ctx) => {
    await ctx.reply(
      'Which way you want to continue with?',
      Markup.keyboard([
        Markup.button.contactRequest('Share Phone Number'),
        Markup.button.callback('Email/Password', 'email'),
        Markup.button.callback('Profile', 'profile')
      ])
    );
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

  bot.hears('Email/Password', async (ctx) => {
    ctx.scene.enter('EMAIL_PASSWORD_LOGIN');
  });

  bot.on('contact', async (ctx) => {
    ctx.scene.enter('PHONE_LOGIN', { phone: ctx.message.contact.phone_number });
  });

  bot.hears('Get Profile', async (ctx) => {
    ctx.scene.enter('GET_PROFILE');
  });

  bot.hears('Edit Profile', async (ctx) => {
    ctx.scene.enter('EDIT_PROFILE');
  });
  await bot.launch();
}
