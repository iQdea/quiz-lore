import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Option } from '../../entities/option.entity';
import { createOptionsDtoRequest, ShowOption, updateOptionDtoRequest } from './option.dto';

@Injectable()
export class OptionService {
  constructor(private readonly em: EntityManager) {}
  async showOptions(question_id: string): Promise<ShowOption[]> {
    const options = await this.em.find(Option, {
      question: question_id
    });
    return options.map((x) => Object.assign(x, { questionId: x.question.id }));
  }
  async createOption(params: RequiredEntityData<Option>): Promise<ShowOption> {
    const em = this.em.fork();
    const option = em.create(Option, params);
    await em.persistAndFlush(option);
    return { ...option, questionId: option.question.id };
  }
  async createOptions({ options }: createOptionsDtoRequest): Promise<ShowOption[]> {
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
    return optionList.map((x) => Object.assign(x, { questionId: x.question.id }));
  }
  async updateOption(data: updateOptionDtoRequest, id: string): Promise<ShowOption> {
    const em = this.em.fork();
    await em.begin();
    const option = await em.findOneOrFail(Option, id);
    option.assign(data);
    const check = em.persist(option);
    if (!(await this.checkOptions(check, option.question.id))) {
      await em.rollback();
      throw new UnprocessableEntityException('At least one option should be an answer');
    }
    await em.commit();
    return { ...option, questionId: option.question.id };
  }
  async removeOption(id: string): Promise<void> {
    const em = this.em.fork();
    const option = await em.findOneOrFail(Option, id);
    await em.removeAndFlush(option);
  }
  async checkOptions(em: any, question_id: string): Promise<boolean> {
    const options = await em.find(Option, {
      isAnswer: true,
      question: question_id
    });
    return options.length > 0;
  }
}
