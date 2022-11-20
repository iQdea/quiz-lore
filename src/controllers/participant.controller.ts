import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthSupertokensGuard } from '../auth/auth-supertokens.guard';
import { UserId } from '../auth/session.decorator';
import { ParticipantService } from '../participant/participant.service';
import { Participant } from '../entities/participant.entity';
import {
  createParticipantDtoRequest,
  createParticipantDtoResponse,
  showParticipantDtoResponse
} from '../participant/participant.dto';
import { EmptyEndpointResponse, EndpointResponse } from '../common/utils/serializer';

@ApiTags('Participant')
@Controller({
  path: 'participant',
  version: '1'
})
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  @ApiOperation({ summary: 'Получить информацию об участнике по id' })
  @UseGuards(AuthSupertokensGuard)
  async getParticipant(@Param('id') participantId: string): EndpointResponse<showParticipantDtoResponse> {
    return {
      dto: showParticipantDtoResponse,
      data: await this.participantService.showParticipant(participantId)
    };
  }

  @Post('/connect')
  @ApiOperation({ summary: 'Подключиться к квизу для участия' })
  @UseGuards(AuthSupertokensGuard)
  async connect(
    @Body() data: createParticipantDtoRequest,
    @UserId() userId: string
  ): EndpointResponse<createParticipantDtoResponse> {
    return {
      dto: createParticipantDtoResponse,
      data: await this.participantService.connect(data, userId)
    };
  }

  @Patch()
  @UseGuards(AuthSupertokensGuard)
  @ApiOperation({ summary: 'Обновить информацию об участнике по id' })
  @ApiExcludeEndpoint()
  async updateParticipant(@Body() data: Participant): Promise<any> {
    return await this.participantService.updateParticipant(data);
  }

  @Delete()
  @UseGuards(AuthSupertokensGuard)
  @ApiOperation({ summary: 'Удалить участника из квиза (если он еще не прошел)' })
  @ApiExcludeEndpoint()
  async removeParticipant(@Param('id') participantId: string): EmptyEndpointResponse {
    await this.participantService.removeParticipant(participantId);
  }
}
