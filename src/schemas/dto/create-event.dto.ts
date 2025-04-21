import { IsString, IsObject, IsOptional, IsNotEmpty } from "class-validator";

export class CreateEventDto {
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sharedSecretToken: string;
}
