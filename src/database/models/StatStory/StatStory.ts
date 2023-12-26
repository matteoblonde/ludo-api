import { modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'statsStory' } })
export class StatStory {

  @prop({
    required: true
  })
  playerId!: string;

  @prop({
    required: true
  })
  statId!: string;

  @prop({
    required: true
  })
  value!: number;

}
