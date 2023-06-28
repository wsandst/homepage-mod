import { promises as fs } from "fs";
import path from "path";

import yaml from "js-yaml";

import createLogger from "utils/logger";
import checkAndCopyConfig, { substituteEnvironmentVars } from "utils/config/config";

const logger = createLogger("command-helpers");

export async function commandsFromConfig() {
  checkAndCopyConfig("commands.yaml");

  const commandsYaml = path.join(process.cwd(), "config", "commands.yaml");
  const rawFileContents = await fs.readFile(commandsYaml, "utf8");
  const fileContents = substituteEnvironmentVars(rawFileContents);
  const commands = yaml.load(fileContents);

  if (!commands) {
    return [];
  }

  // map easy to write YAML objects into easy to consume JS arrays
  const commandsArray = commands.map((commandName) => ({
    name: Object.keys(commandName)[0],
    ...commandName[Object.keys(commandName)[0]],
    type: 'commands'
  }));

  return commandsArray;
}

export async function getCommandItem(commandItemName) {
  const configuredCommands = await commandsFromConfig();

  const command = configuredCommands.find((c) => c.name === commandItemName);
  if (command) {
    return command;
  }

  return false;
}