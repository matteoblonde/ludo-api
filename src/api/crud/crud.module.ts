/* --------
 * Module Definition
 * -------- */
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, RouteModelProvider } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import { AuthModule } from '../auth/auth.module';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';


@Module({
  controllers: [ CrudController ],
  providers  : [
    CrudService,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    },
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class CrudModule {
}
