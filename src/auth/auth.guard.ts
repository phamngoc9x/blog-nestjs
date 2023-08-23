import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtsService: JwtService, private configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeaders(request)

    if (!token) {
      throw new UnauthorizedException();
    }
    try {

      const payload = await this.jwtsService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET'),
      })
      request['user_data'] = payload;
    } catch {
      throw new HttpException({
        status: 419,
        message: "Token expired"
      }, 419)
    }

    return true
  }

  private  extractTokenFromHeaders(request: Request): string | undefined {
    const [type, token ] = request.headers.authorization? request.headers.authorization.split(' ') : []

    return type === 'Bearer' ? token : undefined;
  }
}