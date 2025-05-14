import {Controller,Get,Post,Param,Body,HttpCode,HttpStatus, NotFoundException, UseGuards} from '@nestjs/common';
import { BlackmarketService } from './blackmarket.service';
import { CreateBlackmarketDto } from './dto/create-blackmarket.dto';
import { RoleGuardGuard } from 'src/role-guard/role-guard.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('blackmarket')
export class BlackMarketController {
  BlackMarketRepository: any;
  constructor(private readonly blackMarketService: BlackmarketService) {}

  @Post()

  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBlackMarketTransactionDto: CreateBlackmarketDto,
) {
    return this.blackMarketService.create(createBlackMarketTransactionDto);
  }

  @Get()

  findAll() {
    return this.blackMarketService.findAll();
  }

  @Get(':id')
async findOne(@Param('id') id: string) {
  const transaction = await this.BlackMarketRepository.findOne({
    where: { id },
  });

  if (!transaction) {
    throw new NotFoundException(`Transaction with ID ${id} not found`);
  }

  return transaction;
}
}