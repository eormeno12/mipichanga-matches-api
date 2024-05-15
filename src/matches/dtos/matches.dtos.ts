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
import { Field, FieldLocation, Team } from '../entities/matches.entity';

export type TeamType = 'home' | 'away';

export class AddPlayerDto {
  @ApiProperty({ description: 'Team of the player' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['home', 'away'])
  readonly team: TeamType;

  @ApiProperty({ description: 'Name of the player' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Position of the player' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly pos: number;
}

export class TeamDto {
  @ApiProperty({ description: 'Name of the team' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Lineup of the team' })
  @IsNotEmpty()
  @IsString()
  readonly lineup: string;
}

export class FieldLocationDto implements FieldLocation {
  @ApiProperty({ description: 'The prefix of the location' })
  @IsNotEmpty()
  @IsString()
  readonly prefix: string;

  @ApiProperty({ description: 'The city of the location' })
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @ApiProperty({ description: 'The country of the location' })
  @IsNotEmpty()
  @IsString()
  readonly country: string;
}

export class FieldDto {
  @ApiProperty({ description: 'The id of the field' })
  @IsNotEmpty()
  @IsMongoId()
  readonly _id: string;

  @ApiProperty({ description: 'The name of the field' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The image URL of the field' })
  @IsNotEmpty()
  @IsUrl()
  readonly imageUrl: string;

  @ApiProperty({ description: 'The location of the field' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FieldLocationDto)
  readonly location: FieldLocationDto;
}

export class CreateMatchDto {
  @ApiProperty({ description: 'The name of the match' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The date of the match' })
  @IsNotEmpty()
  @IsDate()
  readonly date: Date;

  @ApiProperty({ description: 'The field of the match' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FieldDto)
  readonly field: Field;

  @ApiProperty({ description: 'The home team of the match' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TeamDto)
  readonly home: Team;

  @ApiProperty({ description: 'The away team of the match' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TeamDto)
  readonly away: Team;
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
