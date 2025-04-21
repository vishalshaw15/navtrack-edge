import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";
    const startTime = Date.now();

    // Log request details
    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - ${ip} - ${userAgent}`
    );

    // Log request body if present (excluding sensitive data)
    if (
      request.body &&
      typeof request.body === "object" &&
      Object.keys(request.body).length > 0
    ) {
      const sanitizedBody = this.sanitizeBody(request.body);
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    // Log query parameters if present
    if (
      request.query &&
      typeof request.query === "object" &&
      Object.keys(request.query).length > 0
    ) {
      this.logger.debug(`Query Parameters: ${JSON.stringify(request.query)}`);
    }

    // Log response details when the request is complete
    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      const duration = Date.now() - startTime;

      this.logger.log(
        `Response: ${method} ${originalUrl} ${statusCode} ${contentLength} - ${duration}ms`
      );
    });

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== "object") {
      return body;
    }

    const sensitiveFields = ["password", "token", "secret", "authorization"];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}
