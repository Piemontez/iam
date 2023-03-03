import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { User } from '../../model/User';
import { Application } from '../../model/System/Application';
import { AuthModule } from '../auth/auth.module';
import { MeController } from './controller/me.controller';
import { RegionAppHeadersCheckMiddleware } from '../auth/middleware/headers-check.middleware';

@Module({
  imports: [
    //
    AuthModule,
    MikroOrmModule.forFeature([Application, User]),
  ],
  controllers: [MeController],
})
export class AppIamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(MeController);
  }
}
