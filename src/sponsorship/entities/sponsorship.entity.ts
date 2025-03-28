import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Sponsor } from 'src/sponsors/entities/sponsor.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { IsInt, Min,Max} from 'class-validator';

@Entity()
export class Sponsorship {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sponsor, sponsor => sponsor.sponsorships)
    sponsor: Sponsor;

    @ManyToOne(() => Esclavo, esclavo => esclavo.sponsorships)
    esclavo: Esclavo;

    @Column()
    @IsInt()
    @Min(0)
    @Max(100)
    strenghtDrug: number;
    
    @Column()
    @IsInt()
    @Min(0)
    @Max(100)
    agilityDrug: number;
}
