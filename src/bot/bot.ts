import { Scenes, Telegraf, session } from 'telegraf';
import {
  emailLoginWizard,
  phoneLoginWizard,
  getProfileWizard,
  editProfileWizard,
  mainWizard,
  profileWizard
} from './scenes';
import appConfig from '../app.config';

export async function bot() {
  const bot = new Telegraf<Scenes.WizardContext>(appConfig().bot.token);
  const stage = new Scenes.Stage([
    emailLoginWizard,
    phoneLoginWizard,
    getProfileWizard,
    editProfileWizard,
    mainWizard,
    profileWizard
  ]);
  bot.use(session());
  bot.use(stage.middleware());
  bot.start(async (ctx) => {
    ctx.scene.enter('MAIN');
  });
  bot.hears('Profile', async (ctx) => {
    ctx.scene.enter('PROFILE');
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
  bot.hears('Cancel', async (ctx) => {
    if (JSON.parse(JSON.stringify(ctx.session)).previousSection === 'start') {
      ctx.scene.enter('MAIN');
    }
  });
  await bot.launch();
}
