import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { CrudModule } from './crud/crud.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LabelTypesModule } from './label-types/label-types.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
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
    MatchesModule,
    TeamsModule,
    NotificationsModule,
    CrudModule,

    /**
     * NestJs Module
     */
    CacheModule.register({
      isGlobal: true,
      ttl     : 3000
    })
  ]

})
export class ApiModule {
}
