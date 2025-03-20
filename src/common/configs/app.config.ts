import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/config-names.enum';
import {
  booleanStringToBoolean,
  TBooleanString,
} from '../utils/boolean-string-to-boolean';

export interface IAppConfig {
  port: number;
  isProduction: boolean;
}

export const getAppConfig = () => {
  const port = parseInt(process.env.PORT);
  const isProduction = booleanStringToBoolean(
    process.env.IS_PROD_ENVIRONMENT as TBooleanString,
  );

  const config: IAppConfig = {
    port: isNaN(port) ? 5001 : port,
    isProduction,
  };
  return config;
};

export default registerAs(ConfigNames.APP, getAppConfig);
