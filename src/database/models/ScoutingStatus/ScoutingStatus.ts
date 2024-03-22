/* --------
* Define the class
* -------- */
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Player } from '../Player/Player';


@modelOptions({ schemaOptions: { collection: 'scoutingStatus' } })
export class ScoutingStatus {

  @prop()
  public status?: string;

  @prop()
  public color?: string;

  @prop()
  public order?: number;

  @prop({
    default: false
  })
  public isDefault!: boolean;

  @prop()
  public minValue?: number;

  @prop()
  public maxValue?: number;

}


/**
 * Get Model from Class
 */
const ScoutingStatusModel = getModelForClass(ScoutingStatus);

/* --------
* Module Exports
* -------- */
export default ScoutingStatusModel;
