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

export const mainWizard = new Scenes.WizardScene<any>('MAIN', async (ctx) => {
  ctx.reply(
    `Hello, to start using bot go to SignInUp, if you are haven't done it yet`,
    Markup.keyboard([
      Markup.button.callback('SignInUp', 'signinup'),
      Markup.button.callback('SignOut', 'signout'),
      Markup.button.callback('Profile', 'profile'),
      Markup.button.callback('Quiz', 'quiz')
    ])
  );
  await ctx.scene.leave();
});

export const signinupWizard = new Scenes.WizardScene<any>('SIGNINUP', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  ctx.reply(
    'Which way you want to continue with?',
    Markup.keyboard([
      Markup.button.contactRequest('Share Phone Number'),
      Markup.button.callback('Email/Password', 'email'),
      Markup.button.callback('Cancel', 'cancel')
    ])
  );
  await ctx.scene.leave();
});

export const profileWizard = new Scenes.WizardScene<any>('PROFILE', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  ctx.reply(
    'Actions with profile',
    Markup.keyboard([
      Markup.button.callback('Get Profile', 'get_profile'),
      Markup.button.callback('Edit Profile', 'edit_profile'),
      Markup.button.callback('Cancel', 'cancel')
    ])
  );
  await ctx.scene.leave();
});

export const quizWizard = new Scenes.WizardScene<any>('QUIZ', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  ctx.reply(
    'Actions with quiz',
    Markup.keyboard([
      Markup.button.callback('Create quiz', 'create_quiz'),
      Markup.button.callback(`Get my quiz's`, `get_user_quiz_collection`),
      Markup.button.callback('Get history', 'get_history'),
      Markup.button.callback('Get current quiz', 'get_quiz'),
      Markup.button.callback('Edit quiz', 'edit_quiz'),
      Markup.button.callback('Questions', 'questions'),
      Markup.button.callback('Cancel', 'cancel')
    ])
  );
  await ctx.scene.leave();
});

export const questionsWizard = new Scenes.WizardScene<any>('QUESTIONS', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'QUIZ' });
  ctx.reply(
    'Actions with questions',
    Markup.keyboard([
      Markup.button.callback('Show questions for quiz', 'show_questions'),
      Markup.button.callback(`Create question`, `create_question`),
      Markup.button.callback('Edit question', 'edit_question'),
      Markup.button.callback('Delete question', 'delete_question'),
      Markup.button.callback('Options', 'options'),
      Markup.button.callback('Cancel', 'cancel')
    ])
  );
  await ctx.scene.leave();
});

export const optionsWizard = new Scenes.WizardScene<any>('OPTIONS', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'QUESTIONS' });
  ctx.reply(
    'Actions with options',
    Markup.keyboard([
      Markup.button.callback('Show options for question', 'show_options'),
      Markup.button.callback(`Create options for question`, `create_options`),
      Markup.button.callback('Edit option', 'edit_option'),
      Markup.button.callback('Delete option', 'delete_option'),
      Markup.button.callback('Cancel', 'cancel')
    ])
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
  optionsWizard
];
