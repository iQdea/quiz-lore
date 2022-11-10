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

export const getProfileActionsKeyboard = () => {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Получить профиль', 'get_profile'),
      Markup.button.callback('Редактировать профиль', 'edit_profile'),
      Markup.button.callback('Отмена', 'cancel')
    ],
    { columns: 2 }
  );
};
export const getQuizActionsKeyboard = () => {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Создать квиз', 'create_quiz'),
      Markup.button.callback(`Отобразить мои квизы`, `get_user_quiz_collection`),
      Markup.button.callback('Отобразить историю прошедших квизов', 'get_history'),
      Markup.button.callback('Отобразить квиз', 'get_quiz'),
      Markup.button.callback('Редактировать квиз', 'edit_quiz'),
      Markup.button.callback('Вопросы', 'questions'),
      Markup.button.callback('Отмена', 'cancel')
    ],
    { columns: 1 }
  );
};
export const getQuestionsActionsKeyboard = () => {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Отобразить вопросы для квиза', 'show_questions'),
      Markup.button.callback(`Создать вопрос`, `create_question`),
      Markup.button.callback('Редактировать вопрос', 'edit_question'),
      Markup.button.callback('Удалить вопрос', 'delete_question'),
      Markup.button.callback('Опции', 'options'),
      Markup.button.callback('Отмена', 'cancel')
    ],
    { columns: 2 }
  );
};
export const getOptionsActionsKeyboard = () => {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Отобразить опции для вопроса', 'show_options'),
      Markup.button.callback(`Создать опции к вопросу`, `create_options`),
      Markup.button.callback('Редактировать опцию', 'edit_option'),
      Markup.button.callback('Удалить опцию', 'delete_option'),
      Markup.button.callback('Отмена', 'cancel')
    ],
    { columns: 2 }
  );
};

export const mainWizard = new Scenes.WizardScene<any>('MAIN', async (ctx) => {
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  let msgid;
  if (!ctx.session.auth) {
    const message = await ctx.reply(
      `Привет, чтобы начать пользоваться ботом необходимо нажать на кнопку Войти, если вы не сделали это ранее.`,
      Markup.inlineKeyboard([Markup.button.callback('Войти', 'signinup')], { columns: 2 })
    );
    msgid = message.message_id;
  } else {
    const message = await ctx.reply(
      `Меню.`,
      Markup.inlineKeyboard(
        [
          Markup.button.callback('Выйти', 'signout'),
          Markup.button.callback('Профиль', 'profile'),
          Markup.button.callback('Квиз', 'quiz')
        ],
        { columns: 2 }
      )
    );
    msgid = message.message_id;
  }
  Object.assign(ctx.session, { last_bot_message_id: msgid });
  await ctx.scene.leave();
});

export const signinupWizard = new Scenes.WizardScene<any>('SIGNINUP', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  const { message_id: msgid } = await ctx.reply(
    'Каким способом вы хотите войти? Если вы ранее не зарегистрировались, ' +
      'то выберите любой из способов, чтобы сделать это сейчас',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('По номеру телефона', 'phone'),
        Markup.button.callback('Через адрес электронной почты', 'email'),
        Markup.button.callback('Отмена', 'cancel')
      ],
      { columns: 1 }
    )
  );
  ctx.session.last_bot_message_id = msgid;
  await ctx.scene.leave();
});

export const allowPhoneWizard = new Scenes.WizardScene<any>('ALLOW_PHONE', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'SIGNINUP' });
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  const { message_id: msgid } = await ctx.reply(
    'Вы уверены? Предоставляя доступ к номеру телефона, вы доказываете, что доверяете нам',
    Markup.keyboard([Markup.button.contactRequest('Да'), Markup.button.callback('Нет', 'no')])
  );
  ctx.session.last_bot_message_id = msgid;
  await ctx.scene.leave();
});

export const profileWizard = new Scenes.WizardScene<any>('PROFILE', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  const { message_id: msgid } = await ctx.reply('Действия с профилем', getProfileActionsKeyboard());
  ctx.session.last_bot_message_id = msgid;
  await ctx.scene.leave();
});

export const quizWizard = new Scenes.WizardScene<any>('QUIZ', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'MAIN' });
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  const { message_id: msgid } = await ctx.reply('Действия с квизом', getQuizActionsKeyboard());
  ctx.session.last_bot_message_id = msgid;
  await ctx.scene.leave();
});

export const questionsWizard = new Scenes.WizardScene<any>('QUESTIONS', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'QUIZ' });
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  const { message_id: msgid } = await ctx.reply('Действия с вопросами', getQuestionsActionsKeyboard());
  ctx.session.last_bot_message_id = msgid;
  await ctx.scene.leave();
});

export const optionsWizard = new Scenes.WizardScene<any>('OPTIONS', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'QUESTIONS' });
  if (ctx.session.messageCounter) {
    for (const i of ctx.session.messageCounter) {
      ctx.deleteMessage(i);
    }
    ctx.session.messageCounter = undefined;
  }
  if (ctx.session.last_bot_message_id) {
    ctx.deleteMessage(ctx.session.last_bot_message_id);
  }
  const { message_id: msgid } = await ctx.reply('Действия с опциями', getOptionsActionsKeyboard());
  ctx.session.last_bot_message_id = msgid;
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
