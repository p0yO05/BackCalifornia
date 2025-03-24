import { PartialType } from '@nestjs/mapped-types';
import { CreateDictadorDto } from './create-dictador.dto';

export class UpdateDictadorDto extends PartialType(CreateDictadorDto) {}
