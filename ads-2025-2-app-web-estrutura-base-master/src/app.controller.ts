import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { PostoService } from './modules/posto-de-combustivel/posto.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postoService: PostoService, // <-- Importado e injetado
  ) {}

  @Get()
  @Render('home')
  async home() {
    const postos = await this.postoService.getAll(); // <-- busca lista

    return {
      titulo: this.appService.getTitulo(),
      listaPostos: postos,     // <-- enviado para a view
      layout: false,
    };
  }

  @Get('home2')
  @Render('home2')
  layout() {
    return { titulo: this.appService.getTitulo() };
  }

  @Get('sobre-mim')
  @Render('sobre')
  sobre() {
    return {};
  }
}
