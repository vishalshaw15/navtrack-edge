import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "./configuration.interface";

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>("PORT", 3000);
  }

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV", "development");
  }

  get mongodbUri(): string {
    return this.configService.get<string>("MONGODB_URI", "");
  }

  get jwt(): Configuration["jwt"] {
    return {
      secret: this.configService.get<string>("JWT_SECRET", "your-secret-key"),
      expiresIn: this.configService.get<string>("JWT_EXPIRATION", "1d"),
    };
  }

  get cors(): Configuration["cors"] {
    return {
      frontendUrl: this.configService.get<string>(
        "FRONTEND_URL",
        "http://localhost:5173"
      ),
      productionUrl: this.configService.get<string>(
        "PRODUCTION_URL",
        "https://your-production-domain.com"
      ),
    };
  }

  get crmMarketplace(): Configuration["crmMarketplace"] {
    return {
      clientId: this.configService.get<string>("CRM_MARKETPLACE_CLIENT_ID", ""),
      clientSecret: this.configService.get<string>(
        "CRM_MARKETPLACE_CLIENT_SECRET",
        ""
      ),
      redirectUri: this.configService.get<string>(
        "CRM_MARKETPLACE_REDIRECT_URI",
        ""
      ),
      scopes: this.configService.get<string>("CRM_MARKETPLACE_SCOPES", ""),
      authUrl: this.configService.get<string>("CRM_MARKETPLACE_AUTH_URL", ""),
      tokenUrl: this.configService.get<string>("CRM_MARKETPLACE_TOKEN_URL", ""),
      sharedSecret: this.configService.get<string>(
        "CRM_MARKETPLACE_SHARED_SECRET",
        ""
      ),
    };
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
}
