import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Player {
  _id: string;
  name: string;
  pos: number;
}

@Schema({ _id: false })
export class PlayerSchema extends Document implements Player {
  @Prop({ type: Types.ObjectId, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  pos: number;
}

export class Team {
  name: string;
  lineup: string;
  players?: Player[];
}

@Schema({ _id: false })
export class TeamSchema extends Document implements Team {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  lineup: string;

  @Prop({ type: [PlayerSchema], default: [] })
  players: Player[];
}

export class FieldLocation {
  prefix: string;
  city: string;
  country: string;
}

@Schema({ _id: false })
export class FieldLocationSchema extends Document implements FieldLocation {
  @Prop({ type: String, required: true })
  prefix: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  country: string;
}

export class Field {
  _id: string;
  name: string;
  imageUrl: string;
  location: FieldLocation;
}

@Schema({ _id: false, timestamps: true })
export class FieldSchema extends Document implements Field {
  @Prop({ type: Types.ObjectId, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  imageUrl: string;

  @Prop({ type: FieldLocationSchema, required: true })
  location: FieldLocation;
}

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  createdBy: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: FieldSchema, required: true })
  field: Field;

  @Prop({ type: TeamSchema, required: true })
  home: Team;

  @Prop({ type: TeamSchema, required: true })
  away: Team;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
