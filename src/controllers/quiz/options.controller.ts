import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Создать опции к вопросу' })
  @UseGuards(AuthSupertokensGuard)
  async createOptionsForQuestion(@Body() data: createOptionsDtoRequest): CollectionResponse<ShowOption> {
    return {
      dto: ShowOption,
      data: await this.optionService.createOptions(data)
    };
  }

  @Get(':question_id')
  @ApiOperation({ summary: 'Получить опции к вопросу' })
  async showOptions(@Param('question_id') question_id: string): CollectionResponse<ShowOption> {
    return {
      dto: ShowOption,
      data: await this.optionService.showOptions(question_id)
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить опцию по id' })
  @UseGuards(AuthSupertokensGuard)
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
  @ApiOperation({ summary: 'Удалить опцию по id' })
  @UseGuards(AuthSupertokensGuard)
  async deleteOption(@Param('id') option_id: string): EmptyEndpointResponse {
    await this.optionService.removeOption(option_id);
  }
}
