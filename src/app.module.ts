// src/app.module.ts (updated for ConfigModule)
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
// import { TransactionsModule } from './transactions/transactions.module';
// import { EscrowModule } from './escrow/escrow.module';
// import { DisputesModule } from './disputes/disputes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    // TransactionsModule,
    // EscrowModule,
    // DisputesModule,
    AuthModule,
  ],
})
export class AppModule {}
