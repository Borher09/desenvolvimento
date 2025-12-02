// src/main.ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as flash from 'express-flash';
import * as exphbs from 'express-handlebars';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { helpers } from './common/helpers/hbs-functions';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração do Handlebars
  const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: join(__dirname, 'views/_layouts'),
    partialsDir: join(__dirname, 'views/_partials'),
    defaultLayout: 'main',
    helpers,
  });

  // Body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configuração das views
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.engine('.hbs', hbs.engine);
  app.setViewEngine('hbs');

  // PUT / DELETE via formulário HTML
  app.use(methodOverride('_method'));

  // Sessão
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  // Flash messages
  app.use(flash());

  // Middleware personalizado
  app.use((req: any, res: any, next: any) => {
    // Adiciona addFlash()
    if (!req.addFlash) {
      req.addFlash = function (type: string, message: string | string[]) {
        if (!req.session.flash) req.session.flash = {};
        if (!req.session.flash[type]) req.session.flash[type] = [];

        if (Array.isArray(message)) {
          req.session.flash[type].push(...message);
        } else {
          req.session.flash[type].push(message);
        }
      };
    }

    // getOld()
    if (!req.getOld) {
      req.getOld = function () {
        return req.session.old || {};
      };
    }

    // setOld()
    if (!req.setOld) {
      req.setOld = function (data: any) {
        req.session.old = data;
      };
    }

    // Disponibiliza mensagens e dados antigos nas views
    res.locals.messages = req.session.flash || {};
    res.locals.old = req.session.old || {};

    next();

    // Limpa **somente depois** da resposta ser enviada
    res.on('finish', () => {
      req.session.flash = {};
      req.session.old = {};
    });
  });

  // Filtro global
  app.useGlobalFilters(new NotFoundExceptionFilter());

  const port = process.env.PORT || 3333;

  await app.listen(port, () =>
    Logger.log(`Servidor rodando na porta ${port}`, 'Bootstrap'),
  );
}

void bootstrap();
