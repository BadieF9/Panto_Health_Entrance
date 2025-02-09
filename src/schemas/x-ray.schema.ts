import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type XrayDocument = HydratedDocument<Xray>;

@Schema()
export class Xray {
  @Prop()
  deviceId: string;

  @Prop()
  time: number;

  @Prop()
  dataLength: number;

  @Prop()
  dataVolume: number;

  @Prop({ type: Array })
  data: [number, [number, number, number]][];
}

export const XraySchema = SchemaFactory.createForClass(Xray);
