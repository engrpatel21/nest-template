import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { SessionSerializer } from '../auth/utils/session-serializer.service';
import { LocalStrategy } from '../auth/strategy/local.strategy';
import { AppModule } from '../../app.module';
import passport  from 'passport';
import RedisStore from 'connect-redis'
import session from 'express-session'
import { REDIS } from '../../shared/shared.module';
import { ConfigService } from '../../shared/config.service';

describe('ProductController', () => {
  let productController: ProductController;
  let app: INestApplication
  let sessionCookie: string
  let configService: ConfigService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
      providers: [ProductService, AuthService, SessionSerializer, LocalStrategy,],
      controllers: [ProductController, AuthController],
    }).compile();
    app = module.createNestApplication();
    productController = app.get<ProductController>(ProductController);
    configService = app.get(ConfigService)
    const redisCLient = app.get(REDIS)
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
    await app.init();
    const response = await request.agent(app.getHttpServer()).post('/auth/sign-in')
    .set('Content-Type', 'application/json')
    .send({ 
      username: 'p',
      password: 'p',
    })
    sessionCookie = response.headers['set-cookie'][0]
  });

  // afterAll(async () => await app.close());

  it('should be defined', () => {
    expect(productController).toBeDefined();

  });
  it('/category GET', async () => {
    return request.agent(app.getHttpServer())
    .get('/product/category')
    .expect(result => {
      expect(result.body.length).toBeGreaterThan(0)
    })
  })

});
