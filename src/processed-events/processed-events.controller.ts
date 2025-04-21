import {
  Controller,
  Get,
  Query,
  UseGuards,
  Headers,
  Request,
  Post,
  Body,
} from "@nestjs/common";
import { ProcessedEventsService } from "./processed-events.service";
import { FilterProcessedEventsDto } from "./dto/filter-processed-events.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ProcessedEventDocument } from "../schemas/processed-event.schema";

interface ProcessedEventsResponse {
  data: ProcessedEventDocument[];
  total: number;
}

interface ProcessingStats {
  totalProcessed: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
  processingTime: {
    min: number;
    max: number;
    avg: number;
  };
}

interface AuthenticatedRequest extends Request {
  user: {
    companyId: string;
    userId: string;
    role: string;
  };
}

@Controller("processed-events")
@UseGuards(JwtAuthGuard)
export class ProcessedEventsController {
  constructor(
    private readonly processedEventsService: ProcessedEventsService
  ) {}

  @Post()
  async findAll(
    @Body() filterDto: FilterProcessedEventsDto,
    @Request() req: AuthenticatedRequest
  ): Promise<ProcessedEventsResponse> {
    const decryptedToken = req.user;

    // Convert string dates to Date objects
    const filterWithUserContext = {
      ...filterDto,
      companyId: decryptedToken.companyId,
      startDate: filterDto.startDate
        ? new Date(filterDto.startDate)
        : undefined,
      endDate: filterDto.endDate ? new Date(filterDto.endDate) : undefined,
    };

    // Only add userId filter for non-admin users
    if (decryptedToken.role !== "admin") {
      filterWithUserContext.userId = decryptedToken.userId;
    }

    return this.processedEventsService.findAll(filterWithUserContext);
  }

  @Get("stats")
  async getProcessingStats(
    @Request() req: AuthenticatedRequest
  ): Promise<ProcessingStats> {
    const decryptedToken = req.user;

    return this.processedEventsService.getProcessingStats();
  }
}
