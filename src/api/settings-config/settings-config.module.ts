import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, getModel, systemDatabaseConnection } from '../../database/database.providers';
import ExerciseTypeModel from '../../database/models/ExerciseType/ExerciseType';
import ExerciseTypeSchema from '../../database/models/ExerciseType/ExerciseType.schema';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import PlayerAttributeModel from '../../database/models/PlayerAttribute/PlayerAttribute';
import PlayerAttributeSchema from '../../database/models/PlayerAttribute/PlayerAttribute.schema';
import PlayerRoleModel from '../../database/models/PlayerRole/PlayerRole';
import PlayerRoleSchema from '../../database/models/PlayerRole/PlayerRole.schema';
import SettingConfigModel from '../../database/models/SettingConfig/SettingConfig';
import SettingConfigSchema from '../../database/models/SettingConfig/SettingConfig.schema';
import TrainingTypeModel from '../../database/models/TrainingType/TrainingType';
import TrainingTypeSchema from '../../database/models/TrainingType/TrainingType.schema';
import { AuthModule } from '../auth/auth.module';
import { SettingsConfigController } from './settings-config.controller';
import { SettingsConfigService } from './settings-config.service';


@Module({
  controllers: [ SettingsConfigController ],
  providers  : [
    SettingsConfigService,
    {
      provide   : SettingConfigModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(SettingConfigModel.collection.name, SettingConfigSchema)
    },
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, LabelTypeModel.collection.name, LabelTypeSchema)
    },
    {
      provide   : ExerciseTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(
        connection,
        ExerciseTypeModel.collection.name,
        ExerciseTypeSchema
      )
    },
    {
      provide   : TrainingTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(
        connection,
        TrainingTypeModel.collection.name,
        TrainingTypeSchema
      )
    },
    {
      provide   : PlayerRoleModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, PlayerRoleModel.collection.name, PlayerRoleSchema)
    },
    {
      provide   : PlayerAttributeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(
        connection,
        PlayerAttributeModel.collection.name,
        PlayerAttributeSchema
      )
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class SettingsConfigModule {

}
