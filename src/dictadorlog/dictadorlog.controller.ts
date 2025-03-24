import { Controller, Post, Body } from '@nestjs/common';
import { DictadorlogService } from './dictadorlog.service';
import { CreateDictadorlogDto } from './dto/create-dictadorlog.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('dictadorlog')
export class DictadorlogController {
    constructor(private readonly dictadorlogService: DictadorlogService) {}

    @Post('register')
    async register(@Body() createDictadorlogDto: CreateDictadorlogDto) {
        return this.dictadorlogService.create(createDictadorlogDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDTO) {
        return this.dictadorlogService.login(loginDto);
    }
}