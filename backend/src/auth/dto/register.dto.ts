import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsUUID } from 'class-validator';
export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) @MaxLength(40) @Matches(/^[a-zA-Z0-9_.-]+$/) username: string;
  @IsString() @MinLength(2) @MaxLength(60) full_name: string;
  @IsString() @MinLength(8) @MaxLength(72) password: string;
  @IsOptional() @IsUUID() university_id?: string;
}
