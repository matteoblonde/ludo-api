import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { CrudModule } from './crud/crud.module';
import { DataCenterModule } from './data-center/data-center.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LabelTypesModule } from './label-types/label-types.module';
import { MatchesModule } from './matches/matches.module';
import { MaybeUsersModule } from './maybe-users/maybe-users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlayersModule } from './players/players.module';
import { PrinterModule } from './printer/printer.module';
import { ScoutedPlayersModule } from './scouted-players/scouted-players.module';
import { SettingsConfigModule } from './settings-config/settings-config.module';
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
    SettingsConfigModule,
    MaybeUsersModule,

    /**
     * Auth Token Connection
     */
    ExercisesModule,
    PlayersModule,
    ScoutedPlayersModule,
    LabelTypesModule,
    TrainingsModule,
    MatchesModule,
    TeamsModule,
    NotificationsModule,
    CrudModule,
    PrinterModule,
    DataCenterModule,

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
