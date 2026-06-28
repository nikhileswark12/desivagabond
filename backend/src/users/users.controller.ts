import { Controller, Get, Put, Delete, Body, Request, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('verify-email')
  @ApiQuery({ name: 'token', required: true })
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Request() req: any, @Body() body: any) {
    const { password, role, ...safe } = body;
    return this.usersService.update(req.user.sub, safe);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('account')
  deleteAccount(@Request() req: any) {
    return this.usersService.delete(req.user.sub);
  }
}
