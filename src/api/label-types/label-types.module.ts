import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';

import { AuthModule } from '../auth/auth.module';
import { LabelTypesController } from './label-types.controller';
import { LabelTypesService } from './label-types.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ LabelTypesController ],
  providers  : [
    LabelTypesService,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class LabelTypesModule {
}
