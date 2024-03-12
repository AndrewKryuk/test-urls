import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe, VersioningType} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../../src/app.module';
import {UrlTaskService} from '../../src/url/services/url-task/url-task.service';
import {firstValueFrom} from 'rxjs';
import {HttpModule} from '@nestjs/axios';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Url} from '../../src/url/entities/url.entity';

describe('Url (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule, TypeOrmModule.forFeature([Url])],
            providers: [UrlTaskService]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.enableCors();
        app.setGlobalPrefix('/api');
        app.useGlobalPipes(new ValidationPipe());
        app.enableVersioning({
            type: VersioningType.URI,
        });
        await app.init();
    });

    beforeEach(async () => globalThis.databaseConfig.clearTable('url'));

    afterAll(async () => app.close());


    it('should add URL without errors', async () => {
        const url = 'https://google.ru';

        const {body: {data}} = await request(app.getHttpServer())
            .post('/api/v1/url')
            .send({url})
            .expect(201);

        expect(data.url).toBe(url);
        expect(data.status).toBe('new');
    });


    it('should return validation error after adding wrong URL', async () => {
        const url = 'wrong url';

        const {body} = await request(app.getHttpServer())
            .post('/api/v1/url')
            .send({url})
            .expect(400);

        expect(body.message).toEqual(['Invalid URL']);
    });


    it('should delete URL without errors', async () => {
        const url = 'https://google.ru';

        const {body: {data}} = await request(app.getHttpServer())
            .post('/api/v1/url')
            .send({url})
            .expect(201);

        expect(data.url).toBe(url);
        expect(data.status).toBe('new');


        const {id} = data;
        const {body: {data: {affected}}} = await request(app.getHttpServer())
            .delete(`/api/v1/url/${id}`)
            .expect(200);

        expect(affected).toBe(1);
    });


    it('should check wrong and valid URLs without errors', async () => {
        const urlTaskService = app.get<UrlTaskService>(UrlTaskService);


        const validUrl = 'https://google.com';

        const {body: {data: validUrlRes}} = await request(app.getHttpServer())
            .post('/api/v1/url')
            .send({url: validUrl})
            .expect(201);

        expect(validUrlRes.url).toBe(validUrl);
        expect(validUrlRes.status).toBe('new');


        const nonExistUrl = 'https://nonexisturl123.com';

        const {body: {data: nonExistUrlRes}} = await request(app.getHttpServer())
            .post('/api/v1/url')
            .send({url: nonExistUrl})
            .expect(201);

        expect(nonExistUrlRes.url).toBe(nonExistUrl);
        expect(nonExistUrlRes.status).toBe('new');


        await firstValueFrom(urlTaskService.checkAndUpdateUrls$());


        const {body: {data}} = await request(app.getHttpServer())
            .get(`/api/v1/url/list`)
            .expect(200);

        expect(data.find((url: Url) => url.id === nonExistUrlRes.id).status).toBe('wrong');
        expect(data.find((url: Url) => url.id === validUrlRes.id).status).toBe('valid');
    });
});
