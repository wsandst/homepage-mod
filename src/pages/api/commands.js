import { createWriteStream, existsSync, readFileSync, unlinkSync } from "fs";
import path from "path";

/* eslint-disable */
import { nanoid } from "nanoid"
/* eslint-enable */

import createLogger from "utils/logger";
import { getCommandItem } from "utils/config/command-helpers";


const logger = createLogger("commands");

async function checkFileExist(filepath, timeout) {
    let totalTime = 0; 
    const checkTime = timeout / 10;

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            totalTime += checkTime;
            const fileExists = existsSync(filepath);
    
            if (fileExists || totalTime >= timeout) {
                clearInterval(timer);
                resolve(fileExists);
            }
        }, checkTime);
    });
}

export default async function handler(req, res) {
    const { group, command, args } = req.query;
    console.log(req.query);

    const commandItem = await getCommandItem(group, command);
    if (!commandItem) {
        logger.debug(`No command item with name ${command} found in group ${group}`);
        return res.status(400).send({
            error: "Unable to find command, see log for details.",
        });
    }

    // Sanitize arguments to prevent bash injection
    let commandString = commandItem.command;
    let argErrorStr = null;
    if (args) {
        const sanitizedArgs = []
        args.split(',').forEach((a) => {
            const sanitizedArg = a.replace(/[^a-zA-Z0-9 "]*/g, '');
            if (a !== sanitizedArg) {
                argErrorStr = `Command argument '${a}' contained illegal characters`;
            }
            sanitizedArgs.push(sanitizedArg);
        })
        if (argErrorStr != null) {
            return res.status(400).send({
                error: argErrorStr,
            });
        }
        sanitizedArgs.forEach((arg, index) => {
            commandString = commandString.replace(`$${index+1}`, arg);
        });
    }

    console.log("Attempting to run command ", commandItem);
    console.log(`Configurated command as: '${commandString}'`);
    const outputFile = `${group}-${command}-${nanoid(9)}-output.txt`
    const commandRunner = path.join(process.cwd(), "config", "commandrunner.pipe");
    const commandRunnerFile = createWriteStream(commandRunner);
    commandRunnerFile.write(`${commandString} &> ../logs/${outputFile}\n`);
    commandRunnerFile.close();

    const timeout = 7000;
    const outputPath = `./config/logs/${outputFile}`
    const fileExists = await checkFileExist(outputPath, timeout);

    if (fileExists) {
      const data = readFileSync(outputPath).toString();
      unlinkSync(outputPath) // Delete the output file
      console.log("Command output: ", data) // Log the output of the command
      return res.status(200).json({
          status: `command '${commandString}' completed`,
          output: data,
      }); 
    }

    console.log("Command timed out!");
    return res.status(400).json({
        status: `command '${commandString}' timed out after ${timeout} ms`,
    });
}
