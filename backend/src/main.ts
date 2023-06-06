import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { REDIS } from './shared/shared.module';
import { ConfigService } from './shared/config.service';
import session from 'express-session'
import RedisStore from 'connect-redis'
import passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisCLient = app.get(REDIS)
  const configService = app.get(ConfigService)
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true,
  });
  app.use(
      session({
      store: new (RedisStore(session))({ client: redisCLient, logErrors: true }),
      name: 'rento',
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: false,
      }
    }),
    passport.initialize(),
    passport.session(),

  )
  const port = 3005
  await app.listen(process.env.PORT || port);
  console.log(`Running on Port: ${port}`)
}
bootstrap();
