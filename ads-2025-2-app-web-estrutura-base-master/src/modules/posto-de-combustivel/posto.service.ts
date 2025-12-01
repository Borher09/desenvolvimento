// src/posto/posto.service.ts
import { Injectable } from '@nestjs/common';
import { Posto } from './posto.entity';

@Injectable()
export class PostoService {
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
    
    // Converter strings vazias para null
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
        return await Posto.delete(id); // Exclusão permanente
    }
}