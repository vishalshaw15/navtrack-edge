import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AppService } from "../../app.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly appService: AppService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decryptedToken = this.appService.decryptSso(token);
      request.user = decryptedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
