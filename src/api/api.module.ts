import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';


@Module({

  imports: [
    DatabaseModule,
    AuthModule,
    ExercisesModule
  ]

})
export class ApiModule {
}
