import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlashMiddleware } from './common/middlewares/flash.middleware';
import { OldMiddleware } from './common/middlewares/old.middleware';
import { ChamadoModule } from './modules/chamado/chamado.modules';
import { PostoModule } from './modules/posto-de-combustivel/posto.modules';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ChamadoModule,  PostoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FlashMiddleware, OldMiddleware).forRoutes('*');
  }
}
