
import { IsEmail, IsString, IsOptional, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user-roles.enum';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2341234567890' })
  @IsString()
  @Matches(/^\+234\d{10}$/, { message: 'Phone number must be in the format +2341234567890' })
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: UserRole.BUYER, enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'CAC123456', required: false })
  @IsOptional()
  @IsString()
  business_verification?: string;
}
