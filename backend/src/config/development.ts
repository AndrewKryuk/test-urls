export default () => ({
    database: {
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: [__dirname + '/../../migrations/*.{ts,js}'],
        database: 'postgres',
        synchronize: true,
    }
});