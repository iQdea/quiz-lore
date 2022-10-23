import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionService } from '../../quiz/options/option.service';
import { createOptionsDtoRequest, ShowOption, updateOptionDtoRequest } from '../../quiz/options/option.dto';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { CollectionResponse, EmptyEndpointResponse, EndpointResponse } from '../../common/utils/serializer';

@ApiTags('Options')
@Controller({
  path: 'option',
  version: '1'
})
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('')
  @UseGuards(AuthSupertokensGuard)
  async createOptionsForQuestion(@Body() data: createOptionsDtoRequest): CollectionResponse<ShowOption> {
    return {
      dto: ShowOption,
      data: await this.optionService.createOptions(data)
    };
  }

  @Get(':question_id')
  async showOptions(@Param('question_id') question_id: string): CollectionResponse<ShowOption> {
    return {
      dto: ShowOption,
      data: await this.optionService.showOptions(question_id)
    };
  }

  @Patch(':id')
  async updateOption(
    @Body() data: updateOptionDtoRequest,
    @Param('id') option_id: string
  ): EndpointResponse<ShowOption> {
    return {
      dto: ShowOption,
      data: await this.optionService.updateOption(data, option_id)
    };
  }

  @Delete(':id')
  async deleteOption(@Param('id') option_id: string): EmptyEndpointResponse {
    await this.optionService.removeOption(option_id);
  }
}
