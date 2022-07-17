import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class OldUser extends Document {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}

export const OldUserSchema = SchemaFactory.createForClass(OldUser);
