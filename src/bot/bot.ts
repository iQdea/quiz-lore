import { Scenes, Telegraf, session } from 'telegraf';
import { scenes } from './scenes';
import appConfig from '../app.config';

export async function bot() {
  const bot = new Telegraf<Scenes.WizardContext>(appConfig().bot.token);
  const stage = new Scenes.Stage(scenes);
  bot
    .use(session())
    .use(stage.middleware())
    .hears('/start', async (ctx) => {
      await ctx.scene.enter('MAIN');
    })
    .hears('SignInUp', async (ctx) => {
      await ctx.scene.enter('SIGNINUP');
    })
    .hears('SignOut', async (ctx) => {
      await ctx.scene.enter('SIGNOUT');
    })
    .hears('Profile', async (ctx) => {
      await ctx.scene.enter('PROFILE');
    })
    .hears('Quiz', async (ctx) => {
      await ctx.scene.enter('QUIZ');
    })
    .hears('Questions', async (ctx) => {
      await ctx.scene.enter('QUESTIONS');
    })
    .hears('Options', async (ctx) => {
      await ctx.scene.enter('OPTIONS');
    })
    .hears('Email/Password', async (ctx) => {
      await ctx.scene.enter('EMAIL_PASSWORD_LOGIN');
    })
    .on('contact', async (ctx) => {
      await ctx.scene.enter('PHONE_LOGIN', { phone: ctx.message.contact.phone_number });
    })
    .hears('Get Profile', async (ctx) => {
      await ctx.scene.enter('GET_PROFILE');
    })
    .hears('Edit Profile', async (ctx) => {
      await ctx.scene.enter('EDIT_PROFILE');
    })
    .hears('Create quiz', async (ctx) => {
      await ctx.scene.enter('CREATE_QUIZ');
    })
    .hears(`Get my quiz's`, async (ctx) => {
      await ctx.scene.enter('GET_QUIZ_USER_COLLECTION');
    })
    .hears('Get history', async (ctx) => {
      await ctx.scene.enter('GET_HISTORY');
    })
    .hears('Get current quiz', async (ctx) => {
      await ctx.scene.enter('GET_QUIZ');
    })
    .hears('Edit quiz', async (ctx) => {
      await ctx.scene.enter('EDIT_QUIZ');
    })
    .hears('Cancel', async (ctx) => {
      const { previousSection } = JSON.parse(JSON.stringify(ctx.session));
      if (previousSection !== undefined) {
        await ctx.scene.enter(previousSection);
      }
    });
  await bot.launch();
}
