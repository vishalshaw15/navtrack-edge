import { Injectable } from "@nestjs/common";
import * as CryptoJS from "crypto-js";
import { ConfigurationService } from "./config/configuration.service";

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigurationService) {}
  decryptSso(ssoDetails: string): Record<string, any> {
    const data = CryptoJS.AES.decrypt(
      ssoDetails,
      this.configService.crmMarketplace.sharedSecret
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  }

  trackEvent(event: string): string {
    return "Event tracked";
  }
}
