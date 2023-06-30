
import { getCommandItem } from "utils/config/command-helpers";
import createLogger from "utils/logger";

import { promises as fs, createWriteStream, existsSync, readFileSync, unlinkSync } from "fs";
import path from "path";


const logger = createLogger("commands");

async function checkFileExist(path, timeout) {
    let totalTime = 0; 
    let checkTime = timeout / 10;

    return await new Promise((resolve, reject) => {
        const timer = setInterval(function() {
            totalTime += checkTime;
            let fileExists = existsSync(path);
    
            if (fileExists || totalTime >= timeout) {
                clearInterval(timer);
                resolve(fileExists);
            }
        }, checkTime);
    });
}

export default async function handler(req, res) {
    const { group, command, args } = req.query;

    const commandItem = await getCommandItem(group, command);
    if (!commandItem) {
        logger.debug(`No command item with name ${command} found in group ${group}`);
        return res.status(400).send({
            error: "Unable to find command, see log for details.",
        });
    }

    // Sanitize arguments to prevent bash injection
    let commandString = commandItem.command;
    if (args) {
        let sanitizedArgs = []
        args.split(',').forEach((a) => {
            const sanitizedArg = a.replace(/[^a-zA-Z0-9 ]*/g, '');
            if (a != sanitizedArg) {
                return res.status(400).send({
                    error: `Command argument '${a}' contained illegal characters`,
                });
            }
            sanitizedArgs.push(sanitizedArg);
        })
        sanitizedArgs.forEach((arg, index) => {
            commandString = commandString.replace(`$${index+1}`, arg);
        });
    }

    console.log("Attempting to run command ", commandItem);
    console.log(`Configurated command as: '${commandString}'`);
    const commandRunner = path.join(process.cwd(), "config", "commandrunner");
    var commandRunnerFile = createWriteStream(commandRunner);
    commandRunnerFile.write(`${commandString}\n`);
    commandRunnerFile.close();

    const timeout = 10000;
    const outputPath = `./config/logs/output.txt`
    const fileExists = await checkFileExist(outputPath, timeout);

    if (fileExists) {
      const data = readFileSync(outputPath).toString();
      //unlinkSync(outputPath) //delete the output file
      console.log("Command output: ", data) //log the output of the command
      return res.status(200).json({
          status: `command '${commandString}' completed`,
          output: data,
      }); 
    }
    else {
      return res.status(200).json({
          status: `command '${commandString}' timed out after ${timeout} ms`,
      });
    }
}
