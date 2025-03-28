import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateDictadorlogDto } from './dto/create-dictadorlog.dto';
import { LoginDTO } from './dto/login.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interface/JwtPayload';
import * as bcrypt from 'bcrypt';
import { Dictadorlog } from './entities/dictadorlog.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DictadorlogService {
    private failedLoginAttempts = new Map<string, number>();

    constructor(
        @InjectRepository(Dictadorlog)
        private readonly dictadorlogRepository: Repository<Dictadorlog>,
        @InjectRepository(Dictador)
        private readonly dictadorRepository: Repository<Dictador>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createDictadorlogDto: CreateDictadorlogDto) {
        const saltRounds = 10; // Factor de costo adecuado
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(createDictadorlogDto.password, salt);  //Seguridad Adicional ante Ataques de fuerza bruta

        const dictador = await this.dictadorRepository.findOne({ where: { id: createDictadorlogDto.dictadorId } });
        if (!dictador) {
            throw new NotFoundException(`Dictador with ID ${createDictadorlogDto.dictadorId} not found`);
        }

        const dictadorlog = this.dictadorlogRepository.create({
            ...createDictadorlogDto,
            password: hashedPassword,
            dictador,
        });

        try {
            await this.dictadorlogRepository.save(dictadorlog);
            return dictadorlog;
        } catch (error) {
            if (error.code === '23505') { // Duplicado en PostgreSQL
                throw new Error('Email already exists');
            }
            throw new Error('Unexpected error during creation');
        }
    }

    private getJwtToken(jwtPayload: JwtPayload): string {
        return this.jwtService.sign(jwtPayload,{ 
            secret: process.env.JWT_SECRET || 'defaultSecretKey',
            expiresIn: '1h',
        });
    }

    async login(loginDto: LoginDTO) {
        const { email, password } = loginDto;

        // Limitar intentos de inicio de sesión fallidos
        const attempts = this.failedLoginAttempts.get(email) || 0;
        if (attempts >= 5) {
            throw new BadRequestException('Too many failed login attempts. Please try fire the one who change your codes and try again later.');
        }

        const dictadorlog = await this.dictadorlogRepository.findOne({ where: { email }, relations: ['dictador'] });

        if (!dictadorlog) {
            this.failedLoginAttempts.set(email, attempts + 1);
            throw new UnauthorizedException('Invalid Dictador Credentials');
        }
                // Verificar que el Dictador asociado existe
        if (!dictadorlog.dictador) {
            throw new UnauthorizedException('No se encontró un Dictador asociado a este usuario.');
        }

        const valid = await bcrypt.compare(password, dictadorlog.password);
        if (!valid) {
            this.failedLoginAttempts.set(email, attempts + 1);
            throw new UnauthorizedException('Invalid Password');
        }

        // Restablecer el contador de intentos fallidos en caso de éxito
        this.failedLoginAttempts.delete(email);

        const jwtPayload: JwtPayload = { email, role: dictadorlog.dictador.rol ?? 'Dictador' };
        const token = this.getJwtToken(jwtPayload);

        return { dictadorlog, token };
    }
}