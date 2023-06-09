import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}
  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    // Save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstname,
          lastName: dto.firstname,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
      }
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // If user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials Incorrect');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If password is incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      // What this means is that when a user signs in, we give that user access to the application for about 15minutes and after that, the token will be rejected and the user needs to sign in again.
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
