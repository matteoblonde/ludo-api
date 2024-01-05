/* --------
 * Module Definition
 * -------- */
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, getModel, systemDatabaseConnection } from '../../database/database.providers';
import CompanyModel from '../../database/models/Company/Company';
import CompanySchema from '../../database/models/Company/Company.Schema';
import MatchModel from '../../database/models/Match/Match';
import MatchSchema from '../../database/models/Match/Match.schema';
import PlayerModel from '../../database/models/Player/Player';
import PlayerSchema from '../../database/models/Player/Player.Schema';
import TeamModel from '../../database/models/Team/Team';
import TeamSchema from '../../database/models/Team/Team.schema';
import TrainingModel from '../../database/models/Training/Training';
import TrainingSchema from '../../database/models/Training/Training.Schema';
import { AuthModule } from '../auth/auth.module';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';


@Module({
  controllers: [ PrinterController ],
  providers  : [
    PrinterService,
    {
      provide   : MatchModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, MatchModel.collection.name, MatchSchema)
    },
    {
      provide   : TrainingModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, TrainingModel.collection.name, TrainingSchema)
    },
    {
      provide   : TeamModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, TeamModel.collection.name, TeamSchema)
    },
    {
      provide   : PlayerModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, PlayerModel.collection.name, PlayerSchema)
    },
    {
      provide   : CompanyModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(CompanyModel.collection.name, CompanySchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class PrinterModule {

}
