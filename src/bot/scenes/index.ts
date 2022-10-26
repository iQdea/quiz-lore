import { Markup, Scenes } from 'telegraf';

export * from './auth';
export * from './profile';

export const mainWizard = new Scenes.WizardScene<any>('MAIN', async (ctx) => {
  ctx.reply(
    'Which way you want to continue with?',
    Markup.keyboard([
      Markup.button.contactRequest('Share Phone Number'),
      Markup.button.callback('Email/Password', 'email'),
      Markup.button.callback('Profile', 'profile')
    ])
  );
  ctx.scene.leave();
});

export const profileWizard = new Scenes.WizardScene<any>('PROFILE', async (ctx) => {
  Object.assign(ctx.session, { previousSection: 'start' });
  ctx.reply(
    'Actions with profile',
    Markup.keyboard([
      Markup.button.callback('Get Profile', 'get_profile'),
      Markup.button.callback('Edit Profile', 'edit_profile'),
      Markup.button.callback('Cancel', 'cancel')
    ])
  );
  ctx.scene.leave();
});
