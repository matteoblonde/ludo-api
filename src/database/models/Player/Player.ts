import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Label } from '../Label/Label';

/* --------
* Define the class
* -------- */
@modelOptions({schemaOptions: {collection: 'players'}})
export class Player {

  @prop({ required: true })
  public userId!: string;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;

  @prop()
  public playerImgUrl?: string;

  @prop()
  public height?: number;

  @prop()
  public weight?: number;

  @prop({
    default: 60
  })
  public value?: number;

  @prop({
    default: 'right'
  })
  public foot?: string;

  @prop()
  public notes?: string;

  @prop()
  public shirtNumber?: number;

  @prop({allowMixed: Severity.ALLOW})
  public labels?: ArraySubDocumentType<Label>

}

/**
 * Get Model from Class
 */
const PlayerModel = getModelForClass(Player);

/* --------
* Module Exports
* -------- */
export default PlayerModel;