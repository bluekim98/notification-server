import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: 'config/.development.env',
            isGlobal: true,
        }),
    ],
})
export class AppConfigModule {}
