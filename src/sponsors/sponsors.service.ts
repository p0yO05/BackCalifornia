import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Estado } from 'src/esclavos/entities/estado.enum';

@Injectable()
export class SponsorService {
  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,

    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
  ) {}

  async create(createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    const { preferred_fighter, company_name, donated_items } = createSponsorDto;

    const fighter = await this.esclavoRepository.findOne({ where: { id: preferred_fighter } });
    if (!fighter) {
      throw new NotFoundException(`No hay un luchador disponible en este momento`);
    }

    fighter.sponsorships = fighter.sponsorships || [];
    const items = donated_items.split(", ");

    items.forEach((item) => {
      const rareza = this.calcularRareza();
      const efecto = this.generarEfecto(rareza);

      fighter.agility = this.aplicarModificacion(fighter.agility, efecto.agilidad);
      fighter.strength = this.aplicarModificacion(fighter.strength, efecto.fuerza);

      // **Modificación del healthStatus según rareza y efecto**
      if (efecto.salud > 0) {
        fighter.healthStatus = this.mejorarSalud(fighter.healthStatus);
      } else {
        fighter.healthStatus = this.deteriorarSalud(fighter.healthStatus);
      }

      // **🔥 Easter Eggs restaurados y expandidos 🔥**
      if (item === "Una Lata de Espinaca") { 
  fighter.agility = 100; 
  fighter.strength = 100; 
  fighter.healthStatus = "Healthy"; 
} else if (item === "La Espada del Olimpo") { 
  fighter.agility = 100; 
  fighter.strength = 100; 
  fighter.healthStatus = "Healthy"; 
} else if (item === "La Doom Shotgun") { 
  fighter.agility = 64; 
  fighter.strength = 64; 
} else if (item === "Un Sandevistan Grado Militar") { 
  fighter.agility = 100; 
  fighter.strength = 30; 
} else if (item === "El Enchiridion") { 
  fighter.agility = 100; 
  fighter.strength = 100; 
  fighter.status = Estado.Alive; 
} else if (item === "Una Bandana de Munición Infinita") { 
  fighter.agility = 100; 
  fighter.strength = 40; 
} else if (item === "Un Sable de Luz") { 
  fighter.agility = 100; 
  fighter.strength = 100; 
} else if (item === "La Chancla") { 
  fighter.agility = 100; 
  fighter.strength = 100; 
} else if (item === "El Anillo Único") { 
  fighter.agility = 100; 
  fighter.strength = 100; 
  fighter.healthStatus = "Healthy"; 
} else if (item === "La Piedra Filosofal") { 
  fighter.healthStatus = "Healthy"; 
  fighter.status = Estado.Alive; 
} else if (item === "Las Botas de Hermes") { 
  fighter.agility = 100; 
} else if (item === "El Escudo de Atenea") { 
  fighter.strength = 100; 
} else if (item === "La BFG 9000") { 
  fighter.agility = 50; 
  fighter.strength = 100; 
} else if (item === "El Ticket Dorado") { 
  fighter.wins = (fighter.wins || 0) + 10; 
} else if (item === "Las Semillas Zenkai") { 
  fighter.strength = 100; 
  fighter.healthStatus = "Healthy"; 
} else if (item === "Semilla del Ermitaño") { 
  const efecto = Math.random() < 0.5 ? "Buff brutal" : "Nada pasa";
  if (efecto === "Buff brutal") {
    fighter.healthStatus = "Healthy";
    fighter.agility += 20;
    fighter.strength += 20;
  }
} else if (item === "Arma Perdida de Elden Ring") { 
  const efecto = Math.random();
  if (efecto < 0.3) {
    fighter.strength = 100;
    fighter.agility = 100;
  } else if (efecto < 0.7) {
    fighter.strength -= 20;
    fighter.agility -= 20;
  } else {
    fighter.healthStatus = "Dead"; 
  }
} else if (item === "Batarang de Batman") { 
  const efecto = Math.random() < 0.5 ? "Precisión letal" : "Rebote aleatorio";
  if (efecto === "Precisión letal") {
    fighter.agility += 15;
  } else {
    fighter.healthStatus = "Injured"; 
  }
} else if (item === "Kit Médico Experimental") { 
  const efecto = Math.random();
  if (efecto < 0.4) {
    fighter.healthStatus = "Healthy";
  } else if (efecto < 0.8) {
    fighter.healthStatus = "Critical";
  } else {
    fighter.healthStatus = "Dead"; 
  }
}
    });

    const newSponsor = this.sponsorRepository.create({
      company_name,
      donated_items,
      preferred_fighter: fighter,
    });

    fighter.sponsorships.push(newSponsor);
    await this.esclavoRepository.save(fighter);
    newSponsor.preferred_fighter = fighter;

    return await this.sponsorRepository.save(newSponsor);
  }

  private calcularRareza(): string {
    const probabilidad = Math.random() * 100;
    if (probabilidad < 60) return "Normal";
    if (probabilidad < 85) return "Extraño";
    if (probabilidad < 95) return "Raro";
    return "Legendario";
  }

  private generarEfecto(rareza: string) {
    const rango = rareza === "Legendario" ? [10, 20] :
                  rareza === "Raro" ? [5, 15] :
                  rareza === "Extraño" ? [2, 10] : [1, 5];

    return {
      agilidad: Math.floor(Math.random() * (rango[1] - rango[0] + 1)) + rango[0],
      fuerza: Math.floor(Math.random() * (rango[1] - rango[0] + 1)) + rango[0],
      salud: Math.random() < 0.5 ? -rango[0] : rango[0]
    };
  }

  private aplicarModificacion(valor: number, modificador: number): number {
    const nuevoValor = valor + modificador;
    return nuevoValor > 100 ? 100 : nuevoValor < 0 ? 0 : nuevoValor;
  }

  private mejorarSalud(status: string): string {
    const progreso = {
      Critical: "Injured",
      Injured: "Healthy",
      Healthy: "Healthy"
    };
    return progreso[status] || "Healthy";
  }

  private deteriorarSalud(status: string): string {
    const progreso = {
      Healthy: "Injured",
      Injured: "Critical",
      Critical: "Dead"
    };
    return progreso[status] || "Dead";
  }
}