import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

import * as pidusage from 'pidusage';
import * as os from 'os';

@Controller('health')
export class HealthController {
  constructor(private health: HealthService) {}

  @Get()
  async check() {
    // return this.health.check([
    //   () => this.http.pingCheck('nestjs-docs', 'http://localhost:3000'),
    // ]);
    // console.log(si);
    // const stat = await pidusage(process.pid);

    // let _stat: any = {};

    // _stat = { ...stat };
    // // Convert from B to MB
    // _stat.memory = stat.memory / 1024 / 1024;
    // _stat.load = os.loadavg();
    // _stat.timestamp = Date.now();

    // console.log(_stat);

    const cpu = await this.health.currentLoad();
    const memory = await this.health.memory();
    const disks = await this.health.getDiskSpace();

    return { cpu, memory, disks };
  }
}
