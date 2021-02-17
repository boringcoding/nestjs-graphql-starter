import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import register from '@react-ssr/nestjs-express/register';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    const configService = app.get(ConfigService);
    await register(app);
    app.setViewEngine('hbs');
    await app.listen(configService.get('PORT'));
}
bootstrap();
