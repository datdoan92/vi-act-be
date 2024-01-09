import {
  ClassSerializerInterceptor,
  INestApplication,
  Module,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { attachRequestMiddleware } from './common/middlewares/attach-request.middleware';
import configFactory from './config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configFactory] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfgSrv: ConfigService) => {
        const ormConfig = cfgSrv.get<TypeOrmModuleOptions>('typeorm');
        if (!ormConfig) {
          throw new Error('TypeORM config not found');
        }
        return ormConfig;
      },
    }),
    UserModule,
  ],
})
export class AppModule {}

/**
 * Init nest app for testing or live run
 */
export function initNestApp(app: INestApplication) {
  app.use(attachRequestMiddleware);
  app.setGlobalPrefix('api');

  // enable URI Versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // enable transforming entity class to json
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get('Reflector')),
  );

  // enable class validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}
