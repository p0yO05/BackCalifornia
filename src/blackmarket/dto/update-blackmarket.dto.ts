import { PartialType } from '@nestjs/mapped-types';
import { CreateBlackmarketDto } from './create-blackmarket.dto';

export class UpdateBlackmarketDto extends PartialType(CreateBlackmarketDto) {}
