import { PartialType } from '@nestjs/mapped-types';
import { CreateEsclavoDto } from './create-esclavo.dto';

export class UpdateEsclavoDto extends PartialType(CreateEsclavoDto) {}