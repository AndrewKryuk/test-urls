import { createDatabase, dropDatabase } from 'typeorm-extension';
import config from '../src/config';
import { DataSource } from 'typeorm';

export class TestDBInitiator {
    private readonly dbOptions = config().database;
    private dataSource: DataSource;
    constructor() {}

    async createDatabase() {
        await this.dropDatabase();

        console.log(`Creating test database '${this.dbOptions.database}'`);

        await createDatabase({
            options: this.dbOptions,
            ifNotExist: false,
        });

        this.dataSource = new DataSource(this.dbOptions);
        await this.dataSource.initialize();

        console.log('Running migrations');

        await this.dataSource.runMigrations({ transaction: 'all' });

        console.log('✓ Done. Test database is ready to accept connections ✓\n');
    }

    async clearTable(table: string) {
        await this.dataSource.query(`TRUNCATE ${table};`);
    }

    async dropDatabase(dropAll = false) {
        console.log(`Dropping test database '${this.dbOptions.database}'`);

        if (dropAll) {
            await this.dataSource.destroy();
        }

        await dropDatabase({
            options: this.dbOptions
        });
    }
}