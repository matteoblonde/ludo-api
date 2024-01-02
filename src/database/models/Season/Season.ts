import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'seasons' } })
export class Season {

  @prop()
  public name?: string;

  @prop()
  public startDate?: Date;

  @prop()
  public endDate?: Date;

  @prop({
    default: false
  })
  public isCurrentSeason!: boolean;

}

/**
 * Get Model from Class
 */
const SeasonModel = getModelForClass(Season);

/* --------
* Module Exports
* -------- */
export default SeasonModel;
