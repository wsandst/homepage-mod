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
  const commandsArray = commands.map((commandGroup) => ({
    name: Object.keys(commandGroup)[0],
    commands: commandGroup[Object.keys(commandGroup)[0]].map((command) => ({
      name: Object.keys(command)[0],
      ...command[Object.keys(command)[0]],
      type: 'commands'
    })),
  }));

  return commandsArray;
}

export async function getCommandItem(group, command) {
  const configuredCommands = await commandsFromConfig();

  const commandGroup = configuredCommands.find((g) => g.name === group);
  if (commandGroup) {
    const commandEntry = commandGroup.commands.find((c) => c.name === command);
    if (commandEntry) return commandEntry;
  }

  return false;
}