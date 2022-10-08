import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { Error as STError } from 'supertokens-node';
import { UserService } from '../user/user.service';
import UserMetadata from 'supertokens-node/recipe/usermetadata';

@Injectable()
export class AuthSupertokensGuard implements CanActivate {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err = undefined;
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    // req.cookies = {
    //   sAccessToken: req.headers['saccesstoken'],
    //   sIdRefreshToken: req.headers['sidrefreshtoken'],
    //   ...req.cookies
    // };

    await verifySession()(req, res, (res) => {
      err = res;
    });

    if (res.headersSent) {
      throw new STError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT'
      });
    }

    if (err) {
      throw err;
    }

    const id = req.session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(id);

    if (!metadata.id) {
      throw new UnauthorizedException();
    }

    req.auth = {
      ...req.auth,
      isAuthenticated: true,
      user: {
        ...req.auth?.user,
        id
      }
    };

    return true;
  }
}

@Injectable()
export class AnonymousGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    req.auth = {
      ...req.auth,
      isAuthenticated: false
    };
    return true;
  }
}
