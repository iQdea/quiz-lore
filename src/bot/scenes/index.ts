import { Markup, Scenes } from 'telegraf';
import { emailLoginWizard, phoneLoginWizard, signoutWizard } from './auth';
import { editProfileWizard, getProfileWizard } from './profile';
import {
  createQuizWizard,
  editQuizWizard,
  getQuizHistoryWizard,
  getQuizUserCollectionWizard,
  getQuizWizard
} from './quiz';
import {
  getQuestionsCollectionWizard,
  createQuestionWizard,
  editQuestionWizard,
  deleteQuestionWizard
} from './question';
import {
  addOptionWizard,
  createOptionsWizard,
  deleteOptionWizard,
  editOptionWizard,
  getOptionsCollectionWizard
} from './option';

export const mainWizard = new Scenes.WizardScene<any>('MAIN', async (ctx) => {
  ctx.reply(
    `Hello, to start using bot go to SignInUp, if you are haven't done it yet`,
    Markup.inlineKeyboard(
      [
        Markup.button.callback('SignInUp', 'signinup'),
        Markup.button.callback('SignOut', 'signout'),
        Markup.button.callback('Profile', 'profile'),
        Markup.button.callback('Quiz', 'quiz')
      ],
      { columns: 2 }
    )
  );
  await ctx.scene.leave();
});

export const signinupWizard = new Scenes.WizardScene<any>('SIGNINUP', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  ctx.reply(
    'Which way you want to continue with?',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('Share Phone Number', 'phone'),
        Markup.button.callback('Email/Password', 'email'),
        Markup.button.callback('Cancel', 'cancel')
      ],
      { columns: 2 }
    )
  );
  await ctx.scene.leave();
});

export const allowPhoneWizard = new Scenes.WizardScene<any>('ALLOW_PHONE', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'SIGNINUP' });
  ctx.reply(
    'Are you sure?',
    Markup.keyboard([Markup.button.contactRequest('Yes'), Markup.button.callback('No', 'no')])
  );
  await ctx.scene.leave();
});

export const profileWizard = new Scenes.WizardScene<any>('PROFILE', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  ctx.reply(
    'Actions with profile',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('Get Profile', 'get_profile'),
        Markup.button.callback('Edit Profile', 'edit_profile'),
        Markup.button.callback('Cancel', 'cancel')
      ],
      { columns: 2 }
    )
  );
  await ctx.scene.leave();
});

export const quizWizard = new Scenes.WizardScene<any>('QUIZ', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  ctx.reply(
    'Actions with quiz',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('Create quiz', 'create_quiz'),
        Markup.button.callback(`Get my quiz's`, `get_user_quiz_collection`),
        Markup.button.callback('Get history', 'get_history'),
        Markup.button.callback('Get current quiz', 'get_quiz'),
        Markup.button.callback('Edit quiz', 'edit_quiz'),
        Markup.button.callback('Questions', 'questions'),
        Markup.button.callback('Cancel', 'cancel')
      ],
      { columns: 2 }
    )
  );
  await ctx.scene.leave();
});

export const questionsWizard = new Scenes.WizardScene<any>('QUESTIONS', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'QUIZ' });
  ctx.reply(
    'Actions with questions',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('Show questions for quiz', 'show_questions'),
        Markup.button.callback(`Create question`, `create_question`),
        Markup.button.callback('Edit question', 'edit_question'),
        Markup.button.callback('Delete question', 'delete_question'),
        Markup.button.callback('Options', 'options'),
        Markup.button.callback('Cancel', 'cancel')
      ],
      { columns: 2 }
    )
  );
  await ctx.scene.leave();
});

export const optionsWizard = new Scenes.WizardScene<any>('OPTIONS', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'QUESTIONS' });
  ctx.reply(
    'Actions with options',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('Show options for question', 'show_options'),
        Markup.button.callback(`Create options for question`, `create_options`),
        Markup.button.callback('Edit option', 'edit_option'),
        Markup.button.callback('Delete option', 'delete_option'),
        Markup.button.callback('Cancel', 'cancel')
      ],
      { columns: 2 }
    )
  );
  await ctx.scene.leave();
});

export const scenes: Scenes.WizardScene<any>[] = [
  signinupWizard,
  signoutWizard,
  emailLoginWizard,
  phoneLoginWizard,
  getProfileWizard,
  editProfileWizard,
  mainWizard,
  profileWizard,
  quizWizard,
  createQuizWizard,
  getQuizUserCollectionWizard,
  getQuizHistoryWizard,
  getQuizWizard,
  editQuizWizard,
  questionsWizard,
  getQuestionsCollectionWizard,
  createQuestionWizard,
  editQuestionWizard,
  deleteQuestionWizard,
  optionsWizard,
  createOptionsWizard,
  addOptionWizard,
  getOptionsCollectionWizard,
  editOptionWizard,
  deleteOptionWizard,
  allowPhoneWizard
];
