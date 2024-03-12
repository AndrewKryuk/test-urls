import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class MyEntity {
    @CreateDateColumn({
        name:    'created_at',
        type:    'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name:     'updated_at',
        type:     'timestamp',
        default:  () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt: Date;
}