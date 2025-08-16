import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private sanitizeUser(user: any) {
    const sanitized = user.toObject ? user.toObject() : user;
    delete sanitized.password_hash;
    delete sanitized.__v; // Remove version key if using Mongoose
    return sanitized;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return this.sanitizeUser(user);
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: this.prepareUserResponse(user)
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      business_verification: registerDto.role === 'seller' 
        ? registerDto.business_verification 
        : undefined
    });

    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: this.prepareUserResponse(user)
    };
  }

  private prepareUserResponse(user: any) {
    const sanitized = this.sanitizeUser(user);
    return {
      _id: sanitized._id,
      email: sanitized.email,
      phone: sanitized.phone,
      role: sanitized.role,
      ...(sanitized.business_verification && { 
        business_verification: sanitized.business_verification 
      }),
      // Add any other fields you want to expose
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { 
        sub: user._id, 
        email: user.email, 
        role: user.role 
      };

      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        user: this.prepareUserResponse(user)
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyToken(userPayload: any) {
    const user = await this.usersService.findOne(userPayload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.prepareUserResponse(user);
  }
}