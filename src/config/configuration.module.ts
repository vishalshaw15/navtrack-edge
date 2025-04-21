import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigurationService } from "./configuration.service";
import { AppService } from "../app.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  providers: [ConfigurationService, AppService],
  exports: [ConfigurationService, AppService],
})
export class ConfigurationModule {}
