import { CallHandler, ClassSerializerInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EndpointResponseBody<D = Record<string, any>, M = Record<string, any>> {
  dto: ClassConstructor<D>;
  errors?: M;
}

export interface SingularReponseBody<D = Record<string, any>, M = Record<string, any>>
  extends EndpointResponseBody<D, M> {
  data: D;
}

export interface CollectionResponseBody<D = Record<string, any>, M = Record<string, any>>
  extends EndpointResponseBody<D, M> {
  data: D[];
}

export type EndpointResponse<D> = Promise<SingularReponseBody<D>>;
export type CollectionResponse<D> = Promise<CollectionResponseBody<D>>;
export type EmptyEndpointResponse = Promise<void>;

@Injectable()
export class ResponseSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseBody: SingularReponseBody | CollectionResponseBody) => {
        if (responseBody) {
          const { dto, data: plainData, errors } = responseBody;
          const data = plainToInstance(dto, plainData);
          return {
            data: this.serialize(data, {}),
            errors
          };
        }
        return {};
      })
    );
  }
}
