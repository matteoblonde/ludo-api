import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LabelTypesModule } from './label-types/label-types.module';
import { PlayersModule } from './players/players.module';


@Module({

  imports: [
    DatabaseModule,
    AuthModule,
    ExercisesModule,
    PlayersModule,
    LabelTypesModule
  ]

})
export class ApiModule {
}
