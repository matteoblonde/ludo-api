import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ExerciseTypesModule } from './exercise-types/exercise-types.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LabelTypesModule } from './label-types/label-types.module';
import { MatchesModule } from './matches/matches.module';
import { PlayerRolesModule } from './player-roles/player-roles.module';
import { PlayerStatsModule } from './player-stats/player-stats.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { TrainingTypesModule } from './training-types/training-types.module';
import { TrainingsModule } from './trainings/trainings.module';
import { UsersModule } from './users/users.module';


@Module({

  imports: [

    /**
     * System Database Connection
     */
    DatabaseModule,
    AuthModule,
    CompaniesModule,
    UsersModule,

    /**
     * Auth Token Connection
     */
    ExercisesModule,
    PlayersModule,
    LabelTypesModule,
    TrainingsModule,
    ExerciseTypesModule,
    TrainingTypesModule,
    PlayerRolesModule,
    PlayerStatsModule,
    MatchesModule,
    TeamsModule
  ]

})
export class ApiModule {
}
