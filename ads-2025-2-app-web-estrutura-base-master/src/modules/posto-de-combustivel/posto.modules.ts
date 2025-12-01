// src/posto/posto.module.ts
import { Module } from '@nestjs/common';
import { PostoController } from './posto.controller';
import { PostoService } from './posto.service';

@Module({
    imports: [],
    controllers: [PostoController],
    providers: [PostoService],
    exports: [PostoService],
})
export class PostoModule { }