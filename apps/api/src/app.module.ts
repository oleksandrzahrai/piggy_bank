import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { DaysModule } from './days/days.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, AppConfigModule, DatabaseModule, DaysModule],
})
export class AppModule {}
