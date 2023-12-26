import { Connection } from 'mongoose';
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
 * Create the default System Database Connection
 * -------- */
export const createConnection = (db: string): mongoose.ConnectOptions & { uri: string } => ({
  uri            : `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${db}`,
  authSource     : process.env.DB_AUTH_SOURCE,
  auth           : {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  maxPoolSize    : 25,
  socketTimeoutMS: 3_000
});

const { uri: systemDatabaseUri, ...systemDatabaseConnectionOptions } = createConnection('__system');
export const systemDatabaseConnection = mongoose.createConnection(systemDatabaseUri, systemDatabaseConnectionOptions);


/**
 * First SignUp connection to initialize the DB for the first time
 */
export async function signUpDatabaseConnection(company: string) {

  const { uri: signUpDatabaseUri, ...signUpDatabaseConnectionOptions } = createConnection(company);

  return mongoose.createConnection(signUpDatabaseUri, signUpDatabaseConnectionOptions);

}

/* --------
 * Provider to load the Mongoose Connection based on Client Request
 * -------- */
const mongooseConnectionsPool = new AugmentedMap<string, mongoose.Connection>();
mongooseConnectionsPool.set(systemDatabaseUri, systemDatabaseConnection);

export const DatabaseConnectionProvider: FactoryProvider = {
  provide   : DATABASE_CONNECTION,
  scope     : Scope.REQUEST,
  inject    : [ REQUEST, AccessTokenService, RefreshTokenService ],
  useFactory: (
    request: Request,
    accessTokenService: AccessTokenService,
    refreshTokenService: RefreshTokenService
  ): mongoose.Connection => {

    const mongooseModuleOptions: mongoose.ConnectOptions & { uri: string } = (() => {
      /** Else, try to load the database from access token */
      const db = accessTokenService.getMongoDatabaseName(request) ?? refreshTokenService.getMongoDatabaseName(request);

      /** Assert the right db has been selected */
      if (db == null) {
        throw new BadRequestException(
          'Could not find a valid database to connect for this request',
          'system/invalid-database'
        );
      }

      /** Return defaults without customDb query param */
      return createConnection(db);
    })();

    const { uri, ...connectOptions } = mongooseModuleOptions;

    return mongooseConnectionsPool.getOrAdd(uri, () => mongoose.createConnection(uri, connectOptions));
  }
};

/**
 * Retrieves a model from the connection if it already exists, otherwise creates a new model using the given schema and registers it with the connection.
 *
 * @param {Connection} connection - The Mongoose connection.
 * @param {string} modelName - The name of the model to retrieve or create.
 * @param {any} schema - The schema to use for creating a new model.
 * @returns {mongoose.Model} - The retrieved or created model.
 */
export const getModel = (connection: Connection, modelName: string, schema: any) => {
  if (connection.models[modelName]) {
    return connection.models[modelName];
  }

  return connection.model(modelName, schema);
};


/* --------
 * Provider to easily inject RouteModel from Database Models Pool
 * -------- */
export const RouteModelProvider: FactoryProvider = {
  provide   : ROUTE_MODEL,
  inject    : [ DATABASE_CONNECTION, REQUEST ],
  useFactory: (connection: mongoose.Connection, request: Request) => {
    /** Check if a params collection has been defined */
    if (!('collection' in request.params) || !request.params.collection) {
      return undefined;
    }

    return getModelFromPool(connection, request.params.collection);
  }
};
