import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import * as pidusage from 'pidusage';
import * as si from 'systeminformation';

const toGB = (byte: number) => byte / 1024 / 1024 / 1024;
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async checkHealth() {
    const stat = await pidusage(process.pid);

    const cpu = await this.currentLoad();
    const memory = await this.memory();

    const _stat: any = {};

    // _stat = { ...stat };
    // Convert from B to MB
    // _stat.memory = stat.memory / 1024 / 1024;
    // _stat.load = os.loadavg();
    // _stat.timestamp = Date.now();
    // _stat.load = cpu;
    _stat.memory = memory.map((mem) => ({
      // ...mem,
      device: mem.device,
      size: `${mem.size / 1024 / 1024 / 1024}`,
    }));

    const disks = await this.getDiskSpace();

    _stat.disk = disks;
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
      const disks = await si.diskLayout();
      return disks;
    } catch (error) {
      console.log(error);
    }
  }

  async getDiskSpace(dir = '/') {
    // const cmd = 'df -h --output=pcent ' + dir;
    // const cmd = `df -P ${dir} | awk '/%/ {print $5}'`;

    // const space = execSync(cmd);

    // return space.toString().split('\n')[0];

    const sizes = await si.fsSize();
    return sizes.map((disk) => ({
      size: toGB(disk.size),
      used: toGB(disk.used),
      available: toGB(disk.available),
      use: disk.use,
      mount: disk.mount,
    }));
  }
}
