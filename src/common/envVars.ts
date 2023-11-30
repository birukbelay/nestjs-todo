import * as dotenv from 'dotenv';
import { ColorEnums, logTrace } from './logger';

/**
 * this is a key value pair of the ENV Default where the key is Env_defaults key and value is the key as a string
 * used to acess enviroment variables
 */
export const ENV_NAMES = proxiedPropertiesOf<ENV_TYPES>();
export function proxiedPropertiesOf<TObj>(obj?: TObj) {
    return new Proxy(
      {},
      {
        get: (_, prop) => prop,
      },
    ) as {
      [P in keyof TObj]: P;
      // [P in keyof TObj]?: P;
    };
  }
export type ENV_TYPES = typeof ENV_DEFAULT;
export const ENV_DEFAULT = {
    NODE_ENV: 'dev',
    JWT_ACCESS_SECRET: 'some long secret',
    JWT_EXPIRY_TIME: 60 * 10, // 60sec *10min  == 10min
    JWT_REFRESH_SECRET: 'some-very-strong-jwt-refresh-secret',
    JWT_REFRESH_EXPIRY_TIME: 60 * 60 * 24 * 7, // 7 days - 60sec * 60min *  24hrs * 7days

}
// this function tries to read from enviroment and throws error if there is no default value, or it is required
export function tryReadEnv(variableId: string, defaultVal?: string, required = false) {
    if (variableId in process.env) {
      return process.env[variableId]!;
    }
    // if the Variable is Not Found
    if (process.env['NODE_ENV'] == 'production' || required) {
      throw new Error(
        `failed to read '${variableId}' environment variable, This IS a Production Enviroment`,
      );
    }
    if (defaultVal != null) {
      return defaultVal;
    }
    throw new Error(`failed to read '${variableId}' environment variable`);
}



// import fs from 'fs';

export const LOAD_ENVS = (req = false): ENV_TYPES => {
  return {
    ...ENV_DEFAULT,
    NODE_ENV: tryReadEnv('NODE_ENV'),
    
    JWT_ACCESS_SECRET: tryReadEnv(ENV_NAMES.JWT_ACCESS_SECRET, ENV_DEFAULT.JWT_ACCESS_SECRET, req),
    JWT_REFRESH_SECRET: tryReadEnv(ENV_NAMES.JWT_REFRESH_SECRET, ENV_DEFAULT.JWT_REFRESH_SECRET),
    JWT_EXPIRY_TIME: parseInt(
      tryReadEnv(ENV_NAMES.JWT_EXPIRY_TIME, `${ENV_DEFAULT.JWT_EXPIRY_TIME}`, req),
    ),
    JWT_REFRESH_EXPIRY_TIME: parseInt(
      tryReadEnv(ENV_NAMES.JWT_REFRESH_EXPIRY_TIME, `${ENV_DEFAULT.JWT_REFRESH_EXPIRY_TIME}`, req),
    ),

  };
};

export class EnvVar {
  private static _instance: EnvVar;
  envVariables: ENV_TYPES;
  private constructor() {
    // we must have a .env file to tell us the Enviroment at first
    dotenv.config({ path: `.env` });
    let mode = tryReadEnv('NODE_ENV', '');

    if (mode === 'prod') {
      // MODE IS PRODUCTION
      dotenv.config({ path: `.env.${mode}` });
      this.envVariables = LOAD_ENVS(true);
    } else {
      logTrace(`NODE_ENV--| ${mode ? mode : 'NO Node_ENV'}`, '', ColorEnums.BgMagenta);
      if (!mode) mode = 'dev';

      // MODE COULD BE TEST || development
      dotenv.config({ path: `.env.${mode}` });
      this.envVariables = LOAD_ENVS(false);
    }
  }

  static get getInstance() {
    if (!EnvVar._instance) {
      EnvVar._instance = new EnvVar();
    }
    return this._instance.envVariables;
    // Do you need arguments? Make it a regular static method instead.
    // return this._instance || (this._instance = new this());
  }
}

export const EnvConfigs = EnvVar.getInstance;