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
    .hears('Show questions for quiz', async (ctx) => {
      await ctx.scene.enter('GET_QUESTIONS_COLLECTION');
    })
    .hears('Create question', async (ctx) => {
      await ctx.scene.enter('CREATE_QUESTION');
    })
    .hears('Edit question', async (ctx) => {
      await ctx.scene.enter('EDIT_QUESTION');
    })
    .hears('Delete question', async (ctx) => {
      await ctx.scene.enter('DELETE_QUESTION');
    })
    .hears('Options', async (ctx) => {
      await ctx.scene.enter('OPTIONS');
    })
    .hears('Create options for question', async (ctx) => {
      await ctx.scene.enter('CREATE_OPTIONS');
    })
    .hears('Add option', async (ctx) => {
      await ctx.scene.enter('ADD_OPTION');
    })
    .hears('Edit option', async (ctx) => {
      await ctx.scene.enter('EDIT_OPTION');
    })
    .hears('Delete option', async (ctx) => {
      await ctx.scene.enter('DELETE_OPTION');
    })
    .hears('Show options for question', async (ctx) => {
      await ctx.scene.enter('GET_OPTIONS_COLLECTION');
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
    })
    .action('start_work', async (ctx) => {
      await ctx.scene.enter('MAIN');
    });
  await bot.launch();
}
