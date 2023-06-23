import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
  cleanDatabase() {
    //In a 1 - N relation, delete N firstly, then delete "1"
    console.log('cleanDatabase');
    return this.$transaction([
      //2 commands in ONE transaction
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
