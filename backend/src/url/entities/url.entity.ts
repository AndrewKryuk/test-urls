import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { MyEntity } from '../../core/entities/my.entity';
import { UrlStatus } from '../types/url-status';

@Entity()
export class Url extends MyEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    url: string;

    @Index({ where: `status = 'new'`})
    @Column({
        type: 'enum',
        nullable: false,
        enum: ['new', 'wrong', 'valid'],
        default: 'new'
    })
    status: UrlStatus;

    @Column({ type: 'smallint', nullable: true })
    statusCode: number;
}