import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Prioridade } from '../prioridade/prioridade.entity';

export enum Situacao {
    Aberto = 'Aberto',
    EmAndamento = 'Em andamento',
    Testando = 'Testando',
    Finalizado = 'Finalizado',
}

@Entity('chamados')
export class Chamado extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column({ type: 'text' })
    descricao: string;

    @Column()
    situacao: string;

    @CreateDateColumn()
    criadoEm: Date;

    @UpdateDateColumn({ nullable: true })
    atualizadoEm: Date;

    @ManyToOne(() => Prioridade)
    // @JoinColumn({
    //     name: "id_pri_fk",
    //     referencedColumnName: "id"
    // })
    prioridade: Prioridade;
}
