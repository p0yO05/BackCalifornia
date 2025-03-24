import { PartialType } from '@nestjs/mapped-types';
import { CreateDictadorlogDto } from './create-dictadorlog.dto';

export class UpdateDictadorlogDto extends PartialType(CreateDictadorlogDto) {}
