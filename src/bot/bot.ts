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
    .action('signinup', async (ctx) => {
      await ctx.scene.enter('SIGNINUP');
    })
    .action('signout', async (ctx) => {
      await ctx.scene.enter('SIGNOUT');
    })
    .action('profile', async (ctx) => {
      await ctx.scene.enter('PROFILE');
    })
    .action('quiz', async (ctx) => {
      await ctx.scene.enter('QUIZ');
    })
    .action('questions', async (ctx) => {
      await ctx.scene.enter('QUESTIONS');
    })
    .action('show_questions', async (ctx) => {
      await ctx.scene.enter('GET_QUESTIONS_COLLECTION');
    })
    .action('create_question', async (ctx) => {
      await ctx.scene.enter('CREATE_QUESTION');
    })
    .action('edit_question', async (ctx) => {
      await ctx.scene.enter('EDIT_QUESTION');
    })
    .action('delete_question', async (ctx) => {
      await ctx.scene.enter('DELETE_QUESTION');
    })
    .action('options', async (ctx) => {
      await ctx.scene.enter('OPTIONS');
    })
    .action('create_options', async (ctx) => {
      await ctx.scene.enter('CREATE_OPTIONS');
    })
    .action('add_option', async (ctx) => {
      await ctx.scene.enter('ADD_OPTION', ctx.session);
    })
    .action('edit_option', async (ctx) => {
      await ctx.scene.enter('EDIT_OPTION');
    })
    .action('delete_option', async (ctx) => {
      await ctx.scene.enter('DELETE_OPTION');
    })
    .action('show_options', async (ctx) => {
      await ctx.scene.enter('GET_OPTIONS_COLLECTION');
    })
    .action('email', async (ctx) => {
      await ctx.scene.enter('EMAIL_PASSWORD_LOGIN');
    })
    .on('contact', async (ctx: any) => {
      await ctx.scene.enter('PHONE_LOGIN', { phone: ctx.message.contact.phone_number });
    })
    .action('get_profile', async (ctx) => {
      await ctx.scene.enter('GET_PROFILE');
    })
    .action('edit_profile', async (ctx) => {
      await ctx.scene.enter('EDIT_PROFILE');
    })
    .action('create_quiz', async (ctx) => {
      await ctx.scene.enter('CREATE_QUIZ');
    })
    .action(`get_user_quiz_collection`, async (ctx) => {
      await ctx.scene.enter('GET_QUIZ_USER_COLLECTION');
    })
    .action('get_history', async (ctx) => {
      await ctx.scene.enter('GET_HISTORY');
    })
    .action('get_quiz', async (ctx) => {
      await ctx.scene.enter('GET_QUIZ');
    })
    .action('edit_quiz', async (ctx) => {
      await ctx.scene.enter('EDIT_QUIZ');
    })
    .hears('❌Нет', async (ctx) => {
      const { previousSection } = JSON.parse(JSON.stringify(ctx.session));
      if (previousSection !== undefined) {
        await ctx.scene.enter(previousSection);
      }
    })
    .action('cancel', async (ctx) => {
      const { previousSection } = JSON.parse(JSON.stringify(ctx.session));
      if (previousSection !== undefined) {
        await ctx.scene.enter(previousSection);
      }
    })
    .action('start_work', async (ctx) => {
      await ctx.scene.enter('MAIN');
    })
    .action('phone', async (ctx) => {
      await ctx.scene.enter('ALLOW_PHONE');
    });
  await bot.launch();
}
