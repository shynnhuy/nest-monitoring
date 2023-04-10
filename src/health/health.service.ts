import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { exec } from 'child_process';

import * as pidusage from 'pidusage';
import * as os from 'os';
import * as si from 'systeminformation';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async checkHealth() {
    const stat = await pidusage(process.pid);

    const cpu = await this.currentLoad();
    const memory = await this.memory();

    let _stat: any = {};

    _stat = { ...stat };
    // Convert from B to MB
    _stat.memory = stat.memory / 1024 / 1024;
    // _stat.load = os.loadavg();
    _stat.timestamp = Date.now();
    _stat.load = cpu;
    _stat.memory = memory;
    this.logger.debug(_stat);
  }

  async cpu() {
    try {
      const cpu = await si.cpu();
      return cpu;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  currentLoad() {
    return si.currentLoad();
  }
  async memory() {
    try {
      const { free, total, used } = await si.mem();
      return { free, total, used };
    } catch (error) {
      console.log(error);
    }
  }

  getDiskSpace(dir = '/') {
    const cmd = 'df -h --output=pcent ' + dir;

    let space = '';
    exec(cmd, function (err, data) {
      if (err) {
        // Error handling
        console.log('ERROR', err);
      } else {
        // Sucess response handling
        console.log('SUCCESS', data);
        space = data;
      }
    });
    return space;
  }
}
