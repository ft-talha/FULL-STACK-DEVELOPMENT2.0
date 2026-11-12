import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: Record<string, any>) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: Record<string, any>) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Get('me')
  getCurrentUser() {
    return {
      success: true,
      user: this.authService.getActiveUser(),
    };
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Get('users')
  getUsers() {
    return {
      success: true,
      data: this.authService.getAllUsers(),
    };
  }
}