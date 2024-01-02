import { Inject, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import DocumentTypeModel from '../../database/models/DocumentType/DocumentType';
import ExerciseTypeModel from '../../database/models/ExerciseType/ExerciseType';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import PlayerAttributeModel from '../../database/models/PlayerAttribute/PlayerAttribute';
import PlayerRoleModel from '../../database/models/PlayerRole/PlayerRole';
import RoleModel from '../../database/models/Role/Role';
import SettingConfigModel from '../../database/models/SettingConfig/SettingConfig';
import TrainingTypeModel from '../../database/models/TrainingType/TrainingType';


@Injectable()
export class SettingsConfigService {

  constructor(
    @Inject(SettingConfigModel.collection.name)
    private readonly settingsConfig: typeof SettingConfigModel,
    @Inject(ExerciseTypeModel.collection.name)
    private readonly exerciseType: typeof ExerciseTypeModel,
    @Inject(TrainingTypeModel.collection.name)
    private readonly trainingType: typeof TrainingTypeModel,
    @Inject(PlayerAttributeModel.collection.name)
    private readonly playerAttribute: typeof PlayerAttributeModel,
    @Inject(PlayerRoleModel.collection.name)
    private readonly playerRole: typeof PlayerRoleModel,
    @Inject(RoleModel.collection.name)
    private readonly roleModel: typeof RoleModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelType: typeof LabelTypeModel,
    @Inject(DocumentTypeModel.collection.name)
    private readonly documentTypeModel: typeof DocumentTypeModel
  ) {
  }


  /**
   * Retrieves the standard settings configuration.
   *
   * @returns {Promise<Object>} A promise that resolves to the standard settings configuration.
   */
  public async getStandardSettingsConfig() {
    return this.settingsConfig.find({ 'isStandard': true });
  }


  /**
   * Creates settings configuration by ID.
   *
   * @param {string} configId - The ID of the configuration.
   * @throws {PreconditionFailedException} - Throws when settings already exist.
   * @throws {NotFoundException} - Throws when the configuration is not found.
   * @returns {Promise<string>} - Resolves with a success message.
   */
  public async createConfigById(configId: string): Promise<string> {

    /** Verify that settings are empty */
    const totalSettingsCount = await this.exerciseType.countDocuments() +
      await this.trainingType.countDocuments() +
      await this.playerAttribute.countDocuments() +
      await this.playerRole.countDocuments() +
      await this.labelType.countDocuments();

    if (totalSettingsCount > 0) {
      throw new PreconditionFailedException({}, 'Settings already exist');
    }

    /** Get config record */
    const config = await this.settingsConfig.findById(configId);
    if (!config) {
      throw new NotFoundException();
    }

    /** Insert many for each setting */
    await this.exerciseType.insertMany(config.exerciseTypes);
    await this.trainingType.insertMany(config.trainingTypes);
    await this.playerAttribute.insertMany(config.playerAttributes);
    await this.playerRole.insertMany(config.playerRoles);
    await this.labelType.insertMany(config.labelTypes);
    await this.roleModel.insertMany(config.roles);
    await this.documentTypeModel.insertMany(config.documentTypes);

    return 'Settings created correctly';
  }

}
