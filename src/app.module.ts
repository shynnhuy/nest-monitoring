import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

import { StatusMonitorModule } from 'nestjs-status-monitor';

@Module({
  imports: [
    HealthModule,
    ScheduleModule.forRoot(),
    StatusMonitorModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
