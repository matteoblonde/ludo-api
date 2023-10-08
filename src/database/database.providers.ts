import * as mongoose from 'mongoose';

import { REQUEST } from '@nestjs/core';

import { BadRequestException, Scope } from '@nestjs/common';
import type { FactoryProvider } from '@nestjs/common';

import { AugmentedMap } from '@proedis/utils';

import { Request } from 'express';

import { getModelFromPool } from './utils';

import { AccessTokenService } from '../token/services/access-token.service';
import { RefreshTokenService } from '../token/services/refresh-token.service';


/* --------
 * Providers Name
 * -------- */
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const ROUTE_MODEL = 'RouteModel';


/* --------
 * Provider to load the Mongoose Connection based on Client Request
 * -------- */
const mongooseConnectionsPool = new AugmentedMap<string, mongoose.Connection>();

export const DatabaseConnectionProvider: FactoryProvider = {
  provide   : DATABASE_CONNECTION,
  scope     : Scope.REQUEST,
  inject    : [ REQUEST ],
  useFactory: (): mongoose.Connection => {

    const mongooseModuleOptions: mongoose.ConnectOptions & { uri: string } = (() => {
      /** Initialize the db name container */
      const db: string = 'ludo';

      /** Return defaults without customDb query param */
      return {
        uri            : `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${db}`,
        authSource     : process.env.DB_AUTH_SOURCE,
        auth           : {
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD
        },
        maxPoolSize    : 25,
        socketTimeoutMS: 3000
      };
    })();

    const { uri, ...connectOptions } = mongooseModuleOptions;

    return mongooseConnectionsPool.getOrAdd(uri, () => mongoose.createConnection(uri, connectOptions));
  }
};


/* --------
 * Provider to easily inject RouteModel from Database Models Pool
 * -------- */
export const RouteModelProvider: FactoryProvider = {
  provide   : ROUTE_MODEL,
  inject    : [ DATABASE_CONNECTION, REQUEST ],
  useFactory: (connection: mongoose.Connection, collection: string) => {
    /** Check if a params collection has been defined */
    if (!collection) {
      return undefined;
    }

    return getModelFromPool(connection, collection);
  }
};
