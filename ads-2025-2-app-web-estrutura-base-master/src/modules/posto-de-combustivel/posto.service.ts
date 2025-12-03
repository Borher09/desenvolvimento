// src/posto/posto.service.ts
import { Inject,Injectable } from '@nestjs/common';
import { Posto } from './posto.entity';
import { DataSource } from 'typeorm';


@Injectable()
export class PostoService {
    constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}
    async getAll() {
        const postos = await Posto.find({
            order: { criadoEm: 'DESC' }
        });
        return postos;
    }

    async findOne(id: number) {
        const posto = await Posto.findOne({
            where: { id: id }
        });
        return posto;
    }

    async create(data: any) {
    console.log('Service - Dados recebidos:', data);
    
    
    Object.keys(data).forEach(key => {
        if (data[key] === '') {
            data[key] = null;
        }
    });
    
    console.log('Service - Dados tratados:', data);
    
    try {
        const posto = Posto.create(data);
        const resultado = await posto.save();
        console.log('Service - Posto salvo:', resultado);
        return resultado;
    } catch (error) {
        console.error('Service - Erro ao salvar:', error);
        throw error;
    }
}

    async update(id: number, data: any) {
        return await Posto.update(id, data);
    }

    async remove(id: number) {
        return await Posto.delete(id); 
    }
async buscarMaisBarato(tipo: string) {
    tipo = tipo.trim();
    const coluna = `preco_${tipo}`;
    console.log("TIPO RECEBIDO:", tipo);
    console.log("COLUNA CONSULTADA:", coluna);
    return await Posto.createQueryBuilder('posto')
        .where(`posto.${coluna} IS NOT NULL`)
        .orderBy(`posto.${coluna}`, 'ASC')
        .getOne();
}


    
}