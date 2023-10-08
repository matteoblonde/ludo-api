import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { DatabaseConnectionProvider } from '../../database/database.providers';
import { AuthModule } from '../auth/auth.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ ExercisesController ],
  providers  : [
    ExercisesService,
    DatabaseConnectionProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class ExercisesModule {
}
