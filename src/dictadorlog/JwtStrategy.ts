import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/interface/JwtPayload";
import { Dictadorlog } from "./entities/dictadorlog.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Dictadorlog)
        private readonly dictatorRepository:Repository<Dictadorlog>
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:'3SC4loR1nAN0CaLiFF0rN14'
        });
    }
    
    async validate(payload:JwtPayload){
       const {email}=payload;
         const dictator=await this.dictatorRepository.
        findOneBy({email:email});
        if(!dictator){
                throw new Error('User not found');
        }
            return dictator;
    }
}