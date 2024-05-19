import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class FieldLocationDto {
  @ApiProperty({ description: 'El prefijo de la ubicación' })
  @IsNotEmpty()
  @IsString()
  readonly prefix: string;

  @ApiProperty({ description: 'La ciudad de la ubicación' })
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @ApiProperty({ description: 'El país de la ubicación' })
  @IsNotEmpty()
  @IsString()
  readonly country: string;
}

export class FieldMatchDto {
  @ApiProperty({ description: 'El ID de la cancha' })
  @IsNotEmpty()
  @IsMongoId()
  readonly _id: string;

  @ApiProperty({ description: 'El nombre de la cancha' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'La URL de la imagen de la cancha' })
  @IsNotEmpty()
  @IsUrl()
  readonly imageUrl: string;

  @ApiProperty({ description: 'La ubicación de la cancha' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FieldLocationDto)
  readonly location: FieldLocationDto;
}

export type TeamType = 'home' | 'away';
export class AddPlayerDto {
  @ApiProperty({ description: 'Equipo del jugador' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['home', 'away'])
  readonly team: TeamType;

  @ApiProperty({ description: 'Nombre del jugador' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Posición del jugador' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly pos: number;
}

export class TeamDto {
  @ApiProperty({ description: 'Nombre del equipo' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Alineación del equipo' })
  @IsNotEmpty()
  @IsString()
  readonly lineup: string;
}

export class CreateMatchDto {
  @ApiProperty({ description: 'Nombre del partido' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Fecha del partido' })
  @IsNotEmpty()
  @IsDate()
  readonly date: Date;

  @ApiProperty({ description: 'Cancha del partido' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FieldMatchDto)
  readonly field: FieldMatchDto;
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
