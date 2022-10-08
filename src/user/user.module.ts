import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '../controllers/user.controller';

@Global()
@Module({
  providers: [UserService],
  imports: [],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
