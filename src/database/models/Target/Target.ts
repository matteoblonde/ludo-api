/* --------
* Schema Definition
* -------- */
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'targets' } })
export class Target {

  @prop()
  public name?: string;

  @prop()
  public description?: string;

}

const TargetModel = getModelForClass(Target);

/* --------
* Module Exports
* -------- */
export default TargetModel;
