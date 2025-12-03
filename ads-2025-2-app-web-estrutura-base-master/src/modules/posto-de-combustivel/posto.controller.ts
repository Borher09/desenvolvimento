// src/posto/posto.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Render,
    Req,
    Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'src/common/validator/generic.validator';
import { PostoDto } from './posto.dto';
import { PostoService } from './posto.service';

@Controller('/posto')
export class PostoController {
    constructor(private readonly postoService: PostoService) {}

    @Get()
    @Render('posto/listagem')
    async consulta() {
        const postos = await this.postoService.getAll();
        return { listaPostos: postos };
    }

    @Get('/novo')
    @Render('posto/formulario-cadastro')
    async formularioCadastro() {
        return {};
    }

    @Post('/novo/salvar')
    async formularioCadastroSalvar(
        @Body() dadosForm: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        console.log("Controller - Dados recebidos:", dadosForm);

        const resultado = await validate(PostoDto, dadosForm);

        if (resultado.isError) {
            req.addFlash('error', resultado.getErrors);
            req.setOld(dadosForm);
            return res.redirect('/posto/novo');
        }

        await this.postoService.create(dadosForm);
        req.addFlash('success', 'Posto cadastrado com sucesso!');
        return res.redirect('/posto');
    }
    @Get('/buscar/barato/:tipo')
@Render('posto/mais-barato')
async buscarMaisBarato(@Param('tipo') tipo: string, @Req() req: Request) {
    console.log("TIPO RECEBIDO:", tipo);

    try {
        const posto = await this.postoService.buscarMaisBarato(tipo);

        if (!posto) {
            req.addFlash('error', `Nenhum preço encontrado para o tipo: ${tipo}`);
            return { posto: null, tipo, preco: null };
        }

        const campoPreco = `preco_${tipo}`;

      
        const preco = posto[campoPreco];

        return { posto, tipo, preco };

    } catch (error) {
        req.addFlash('error', error.message);
        return { posto: null, tipo, preco: null };
    }
}


    @Get('/:id/exclusao')
    @Render('posto/formulario-exclusao')
    async formularioExclusao(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        const posto = await this.postoService.findOne(id);

        if (!posto) {
            req.addFlash('error', 'O posto solicitado não foi encontrado!');
            return { redirect: '/posto' };
        }

        return { posto };
    }

    @Delete('/:id/exclusao')
    async excluir(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const posto = await this.postoService.findOne(id);

        if (!posto) {
            req.addFlash('error', 'O posto solicitado não foi encontrado!');
        } else {
            req.addFlash('success', `Posto: ${posto.nome} excluído com sucesso!`);
            await this.postoService.remove(id);
        }

        return res.redirect('/posto');
    }

    @Get('/:id/atualizacao')
    @Render('posto/formulario-atualizacao')
    async formularioAtualizacao(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        const posto = await this.postoService.findOne(id);

        if (!posto) {
            req.addFlash('error', 'O posto solicitado não foi encontrado!');
            return { redirect: '/posto' };
        }

        return { posto };
    }

    @Put('/:id/atualizacao-salvar')
    async atualizacaoSalvar(
        @Param('id') id: number,
        @Body() dados: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const posto = await this.postoService.findOne(id);

        if (!posto) {
            req.addFlash('error', 'O posto solicitado não foi encontrado!');
            return res.redirect('/posto');
        }

        const resultado = await validate(PostoDto, dados);

        if (resultado.isError) {
            req.addFlash('error', resultado.getErrors);
            req.setOld(dados);
            return res.redirect(`/posto/${id}/atualizacao`);
        }

        await this.postoService.update(id, dados);
        req.addFlash('success', 'Posto atualizado com sucesso!');
        return res.redirect('/posto');
    }


    
}
