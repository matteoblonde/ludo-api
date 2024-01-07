import { getModelForClass, modelOptions, prop, SubDocumentType } from '@typegoose/typegoose';
import { PlayerAttribute } from '../PlayerAttribute/PlayerAttribute';


@modelOptions({ schemaOptions: { collection: 'attributesStory' } })
export class AttributeStory {

  @prop({
    required: true
  })
  playerId!: string;

  @prop({
    required: true
  })
  attribute!: SubDocumentType<PlayerAttribute>;

  @prop({
    default: new Date()
  })
  date!: Date;

}

/**
 * Get Model from Class
 */
const AttributeStoryModel = getModelForClass(AttributeStory);

/* --------
* Module Exports
* -------- */
export default AttributeStoryModel;
