import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { DocumentType } from '../DocumentType/DocumentType';
import { ExerciseType } from '../ExerciseType/ExerciseType';
import { LabelType } from '../LabelType/LabelType';
import { PlayerAttribute } from '../PlayerAttribute/PlayerAttribute';
import { PlayerRole } from '../PlayerRole/PlayerRole';
import { Role } from '../Role/Role';
import { Target } from '../Target/Target';
import { TrainingType } from '../TrainingType/TrainingType';


@modelOptions({ schemaOptions: { collection: 'settingsConfig' } })
export class SettingConfig {

  @prop()
  public name!: string;

  @prop({
    default: true
  })
  public isStandard!: boolean;

  @prop({
    default: 'ITA'
  })
  public language?: string;

  @prop()
  public description?: string;

  @prop()
  public icon?: string;

  @prop()
  public creator?: string;

  @prop()
  public value?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public exerciseTypes?: ArraySubDocumentType<ExerciseType>;

  @prop({ allowMixed: Severity.ALLOW })
  public trainingTypes?: ArraySubDocumentType<TrainingType>;

  @prop({ allowMixed: Severity.ALLOW })
  public playerAttributes?: ArraySubDocumentType<PlayerAttribute>;

  @prop({ allowMixed: Severity.ALLOW })
  public playerRoles?: ArraySubDocumentType<PlayerRole>;

  @prop({ allowMixed: Severity.ALLOW })
  public roles?: ArraySubDocumentType<Role>;

  @prop({ allowMixed: Severity.ALLOW })
  public labelTypes?: ArraySubDocumentType<LabelType>;

  @prop({ allowMixed: Severity.ALLOW })
  public documentTypes?: ArraySubDocumentType<DocumentType>;

  @prop({ allowMixed: Severity.ALLOW })
  public targets?: ArraySubDocumentType<Target>;

}

/**
 * Get Model from Class
 */
const SettingConfigModel = getModelForClass(SettingConfig);

/* --------
* Module Exports
* -------- */
export default SettingConfigModel;
