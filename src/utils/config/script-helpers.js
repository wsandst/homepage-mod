import { promises as fs } from "fs";
import path from "path";

import yaml from "js-yaml";

import createLogger from "utils/logger";
import checkAndCopyConfig, { substituteEnvironmentVars } from "utils/config/config";

const logger = createLogger("script-helpers");

export async function scriptsFromConfig() {
  checkAndCopyConfig("scripts.yaml");

  const scriptsYaml = path.join(process.cwd(), "config", "scripts.yaml");
  const rawFileContents = await fs.readFile(scriptsYaml, "utf8");
  const fileContents = substituteEnvironmentVars(rawFileContents);
  const scripts = yaml.load(fileContents);

  if (!scripts) {
    return [];
  }

  // map easy to write YAML objects into easy to consume JS arrays
  const scriptsArray = scripts.map((scriptName) => ({
    name: Object.keys(scriptName)[0],
    ...scriptName[Object.keys(scriptName)[0]],
    type: 'scripts'
  }));

  return scriptsArray;
}

export async function getScriptItem(scriptItemName) {
  const configuredScripts = await scriptsFromConfig();

  const script = configuredScripts.find((s) => s.name === scriptItemName);
  if (script) {
    return script;
  }

  return false;
}