import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AuthModuleConfig } from './auth/config-supertokens.interface';

export interface AppConfig {
  port: number;
  database: string;
  supertokens: AuthModuleConfig;
  cors: CorsOptions;
  bot: {
    token: string;
  };
}

export default (): AppConfig => ({
  port: 3300,
  database: process.env.DATABASE_URL || '',
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URL || '',
    apiKey: process.env.SUPERTOKENS_API_KEY || '',
    appInfo: {
      appName: process.env.APP_NAME || '',
      apiDomain: process.env.API_DOMAIN || '',
      websiteDomain: process.env.WEBSITE_DOMAIN || '',
      apiBasePath: process.env.API_BASE_PATH || '',
      websiteBasePath: process.env.WEBSITE_BASE_PATH || ''
    }
  },
  cors: {
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  },
  bot: {
    token: process.env.BOT_TOKEN || ''
  }
});
