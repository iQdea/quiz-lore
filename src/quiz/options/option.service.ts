import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Option } from '../../entities/option.entity';
import { createOptionsDtoRequest, OptionsDtoResponse } from './option.dto';

@Injectable()
export class OptionService {
  constructor(private readonly em: EntityManager) {}
  async showOptions(question_id: string): Promise<OptionsDtoResponse> {
    const options = await this.em.find(Option, {
      question: question_id
    });
    return { options: options.map((x) => Object.assign(x, { questionId: x.question.id })) };
  }
  async createOption(params: RequiredEntityData<Option>): Promise<Option> {
    const em = this.em.fork();
    const option = em.create(Option, params);
    await em.persistAndFlush(option);
    return option;
  }
  async createOptions({ options }: createOptionsDtoRequest): Promise<OptionsDtoResponse> {
    const em = this.em.fork();
    const optionList: Option[] = [];
    for (const option of options) {
      const optionCreated = em.create(Option, {
        ...option,
        question: option.questionId
      });
      optionList.push(optionCreated);
    }
    await em.persistAndFlush(optionList);
    return { options: optionList.map((x) => Object.assign(x, { questionId: x.question.id })) };
  }
  async updateOption(data: any, id: string): Promise<any> {}
  async removeOption(id: string): Promise<any> {}
}
