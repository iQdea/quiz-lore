import { Injectable } from '@nestjs/common';
import { RecipeListFunction } from 'supertokens-node/lib/build/types';
import DashBoard from 'supertokens-node/recipe/dashboard';
import appConfig from '../../app.config';

@Injectable()
export class DashboardService {
  init(): RecipeListFunction {
    return DashBoard.init({
      apiKey: appConfig().supertokens.apiKey
    });
  }
}
