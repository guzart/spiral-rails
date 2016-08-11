// @flow

import * as utils from './utils';

function getProjectConfig(env: string): ProjectConfig {
  const projectConfigFactory = require(utils.railsPath('~config/hauler.js'));
  return projectConfigFactory(env);
}

function getProjectDefaults(env: string): ProjectConfig {
  const projectDefaultsFactory = require('./defaults/project_config_factory');
  return projectDefaultsFactory.default(env);
}

function getConfigFactory(): ProjectConfigFactory {
  return (env: string) => {
    const projectDefaults = getProjectDefaults(env);
    const projectConfig = getProjectConfig(env);
    const config = utils.mergeProjectConfig(projectDefaults, projectConfig);
    return config;
  };
}

export function getConfig(env: string, railsRoot: string, appName: string) {
  utils.setRailsRoot(railsRoot);
  const configFactory = getConfigFactory();
  const config = configFactory(env);
  return Object.assign(config, { appName });
}

export function getDevServerConfig(
  env: string, railsRoot: string, appName: string
): WebpackDevServerConfig {
  const config = getConfig(env, railsRoot, appName);
  return utils.extractDevServerConfig(config);
}

export function getCompilerConfig(
  env: string, railsRoot: string, appName: string
): WebpackConfig {
  const config = getConfig(env, railsRoot, appName);
  return utils.extractCompilerConfig(config);
}

export { getEnvName } from './utils';
