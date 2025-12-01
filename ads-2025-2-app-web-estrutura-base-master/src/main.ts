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
  const hbs = exphbs.create({
    extname: '.hbs', // Extensão dos arquivos
    layoutsDir: join(__dirname, 'views/_layouts'), // Pasta de layouts
    partialsDir: join(__dirname, 'views/_partials'), // Pasta de partials
    defaultLayout: 'main', // Layout padrão
    helpers,
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // Configurar arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Configurar views
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.engine('.hbs', hbs.engine);
  app.setViewEngine('hbs');

  // Middlewares
  app.use(methodOverride('_method')); // Para suportar PUT e DELETE em formulários
  
  // Configurar sessão
  app.use(
    session({
      secret: 'my-secret', // Mude para uma chave segura em produção
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      }
    }),
  );
  
  // Configurar flash messages
  app.use(flash());

  // Adicionar middlewares personalizados se necessário
  app.use((req: any, res: any, next: any) => {
    // Middleware para adicionar métodos ao request
    if (!req.addFlash) {
      req.addFlash = function(type: string, message: string | string[]) {
        if (!req.session.flash) {
          req.session.flash = {};
        }
        if (!req.session.flash[type]) {
          req.session.flash[type] = [];
        }
        
        if (Array.isArray(message)) {
          req.session.flash[type].push(...message);
        } else {
          req.session.flash[type].push(message);
        }
      };
    }

    if (!req.getOld) {
      req.getOld = function() {
        return req.session.old || {};
      };
    }

    if (!req.setOld) {
      req.setOld = function(data: any) {
        req.session.old = data;
      };
    }

    // Tornar flash messages disponíveis em todas as views
    res.locals.messages = req.session.flash || {};
    res.locals.old = req.session.old || {};
    
    // Limpar flash messages após exibi-las
    req.session.flash = {};
    req.session.old = {};
    
    next();
  });

  // Filtro global para tratamento de exceções
  app.useGlobalFilters(new NotFoundExceptionFilter());

  const port = process.env.PORT || 3333;

  await app.listen(port, () =>
    Logger.log(`Servidor rodando na porta ${port}`, 'Bootstrap'),
  );
}
void bootstrap();