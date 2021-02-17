var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard, } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            KeycloakConnectModule.register({
                authServerUrl: 'http://localhost:8081/auth',
                realm: 'flashrealm',
                clientId: 'nest-app',
                secret: 'e33d68e6-7d6d-428e-a44f-e0fac3803848',
            }),
            ConfigModule.forRoot({
                validationSchema: Joi.object({
                    PORT: Joi.number().required(),
                }),
            }),
            // GraphQLModule.forRootAsync({
            //   imports: [ConfigModule],
            //   inject: [ConfigService],
            //   useFactory: (configService: ConfigService) => ({
            //     playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
            //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            //   }),
            // }),
            DatabaseModule,
            UsersModule,
        ],
        controllers: [AppController],
        providers: [
            {
                provide: APP_GUARD,
                useClass: AuthGuard,
            },
            {
                provide: APP_GUARD,
                useClass: ResourceGuard,
            },
            {
                provide: APP_GUARD,
                useClass: RoleGuard,
            },
        ],
    })
], AppModule);
export { AppModule };
