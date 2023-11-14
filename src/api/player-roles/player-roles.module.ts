import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import PlayerRoleModel from '../../database/models/PlayerRole/PlayerRole';
import PlayerRoleSchema from '../../database/models/PlayerRole/PlayerRole.schema';

import { AuthModule } from '../auth/auth.module';
import { PlayerRolesController } from './player-roles.controller';
import { PlayerRolesService } from './player-roles.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ PlayerRolesController ],
  providers  : [
    PlayerRolesService,
    {
      provide   : PlayerRoleModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(PlayerRoleModel.collection.name, PlayerRoleSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class PlayerRolesModule {
}
