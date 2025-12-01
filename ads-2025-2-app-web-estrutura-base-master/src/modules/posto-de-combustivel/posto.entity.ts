// src/posto/posto.entity.ts
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('postos')
export class Posto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    endereco: string;

    @Column({ nullable: true })
    telefone: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    preco_gasolina_comum: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    preco_gasolina_aditivada: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    preco_etanol: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    preco_diesel: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    preco_diesel_s10: number;

    @CreateDateColumn()
    criadoEm: Date;

    @UpdateDateColumn({ nullable: true })
    atualizadoEm: Date;
}