import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  getData(): { message: string } {
    return { message: 'Hello from the back end!' };
  }

  @Post('login')
  login(@Body() body: { role: string, name: string, password: string }): { message: string } {
    // Validate the role, name, and password
    if (body.role === 'Dictador' && body.name === 'validName' && body.password === 'validPassword') {
      console.log(`User logged in with role: ${body.role}, name: ${body.name}`);
      return { message: 'Login successful' };
    } else {
      return { message: 'Access denied' };
    }
  }

  @Post('register')
  register(@Body() body: { role: string, name: string, password: string }): { message: string } {
    // Simulate user registration
    console.log(`User registered with role: ${body.role}, name: ${body.name}`);
    return { message: 'Registration successful' };
  }
}