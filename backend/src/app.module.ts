import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongodbUri = configService.get<string>('MONGODB_URI');

        if (!mongodbUri) {
          throw new Error('MONGODB_URI is not defined');
        }

        return {
          uri: mongodbUri,
        };
      },
    }),

    EventsModule,
  ],
})
export class AppModule {}
