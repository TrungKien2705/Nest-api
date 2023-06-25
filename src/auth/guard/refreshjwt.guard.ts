import { AuthGuard } from '@nestjs/passport';

export default class MyJwtGuardRefresh extends AuthGuard('jwt-refresh-token') {}
