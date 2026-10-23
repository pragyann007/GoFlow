import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-types.enum';
import { AUTHENTICATION_DECORATOR_KEY } from '../constants/auth-key';

export const Authentication = (...authType: AuthType[]) => SetMetadata(AUTHENTICATION_DECORATOR_KEY, authType);
