import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/decrypt-sso")
  decryptSso(@Body() body: { ssoDetails: string }): Record<string, any> {
    return this.appService.decryptSso(body.ssoDetails);
  }
}
