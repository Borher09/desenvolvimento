// src/posto/posto.dto.ts
import { IsNotEmpty, MinLength, IsNumber, Min, IsOptional } from 'class-validator';

export class PostoDto {
    @IsNotEmpty({ message: 'O Nome do posto é obrigatório' })
    @MinLength(3, { message: 'O Nome deve ter no mínimo 3 caracteres' })
    nome: string;

    @IsNotEmpty({ message: 'O Endereço é obrigatório' })
    @MinLength(5, { message: 'O Endereço deve ter no mínimo 5 caracteres' })
    endereco: string;

    @IsOptional()
    telefone: string;

    @IsOptional()
    @IsNumber({}, { message: 'O preço da Gasolina Comum deve ser um número' })
    @Min(0, { message: 'O preço não pode ser negativo' })
    preco_gasolina_comum?: number;

    @IsOptional()
    @IsNumber({}, { message: 'O preço da Gasolina Aditivada deve ser um número' })
    @Min(0, { message: 'O preço não pode ser negativo' })
    preco_gasolina_aditivada?: number;

    @IsOptional()
    @IsNumber({}, { message: 'O preço do Etanol deve ser um número' })
    @Min(0, { message: 'O preço não pode ser negativo' })
    preco_etanol?: number;

    @IsOptional()
    @IsNumber({}, { message: 'O preço do Diesel deve ser um número' })
    @Min(0, { message: 'O preço não pode ser negativo' })
    preco_diesel?: number;

    @IsOptional()
    @IsNumber({}, { message: 'O preço do Diesel S10 deve ser um número' })
    @Min(0, { message: 'O preço não pode ser negativo' })
    preco_diesel_s10?: number;
}