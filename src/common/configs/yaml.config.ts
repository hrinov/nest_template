import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { YamlConfig } from '../types/yaml-config.types';
import { getAppConfig } from './app.config';

const useProdConfig = getAppConfig().isProduction;

const YAML_CONFIG_FILENAME = useProdConfig
  ? 'config.prod.yaml'
  : 'config.dev.yaml';

export const yamlConfig = yaml.load(
  readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
) as YamlConfig;
