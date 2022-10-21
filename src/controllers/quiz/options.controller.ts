import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionService } from '../../quiz/options/option.service';
import { createOptionsDtoRequest, OptionsDtoResponse } from '../../quiz/options/option.dto';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { EndpointResponse } from '../../common/utils/serializer';

@ApiTags('Options')
@Controller({
  path: 'option',
  version: '1'
})
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('')
  @UseGuards(AuthSupertokensGuard)
  async createOptionsForQuestion(@Body() data: createOptionsDtoRequest): EndpointResponse<OptionsDtoResponse> {
    return {
      dto: OptionsDtoResponse,
      data: await this.optionService.createOptions(data)
    };
  }

  @Get(':question_id')
  async showQuestions(@Param('question_id') question_id: string): EndpointResponse<OptionsDtoResponse> {
    return {
      dto: OptionsDtoResponse,
      data: await this.optionService.showOptions(question_id)
    };
  }
}
