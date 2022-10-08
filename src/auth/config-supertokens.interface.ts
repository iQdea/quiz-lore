import { AppInfo } from 'supertokens-node/lib/build/types';

export const ConfigInjectionToken = 'SupertokensToken';

export interface AuthModuleConfig {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey: string;
}
