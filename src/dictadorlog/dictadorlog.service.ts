import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDictadorlogDto } from './dto/create-dictadorlog.dto';
import { LoginDTO } from './dto/login.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interface/JwtPayload';
import * as bcrypt from 'bcrypt';
import { Dictadorlog } from './entities/dictadorlog.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DictadorlogService {
    constructor(
        @InjectRepository(Dictadorlog)
        private readonly dictatorRepository: Repository<Dictadorlog>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createDictadorlogDto: CreateDictadorlogDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createDictadorlogDto.password, salt);

        const dictator = this.dictatorRepository.create({
            ...createDictadorlogDto,
            password: hashedPassword,
        });

        try {
            await this.dictatorRepository.save(dictator);
            return dictator;
        } catch (error) {
            if (error.code === '23505') { // Duplicado en PostgreSQL
                throw new Error('Email already exists');
            }
            throw new Error('Unexpected error during creation');
        }
    }

    private getJwtToken(jwtPayload: JwtPayload): string {
        return this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
    }

    async login(loginDto: LoginDTO) {
        const { email, password } = loginDto;
        const dictador = await this.dictatorRepository.findOneBy({ email });

        if (!dictador) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(password, dictador.password);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const jwtPayload: JwtPayload = { email, role: dictador.rol ?? 'Dictador' };
        const token = this.getJwtToken(jwtPayload);

        return { dictador, token };
    }
}