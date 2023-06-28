
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
    const { name } = req.query;
    console.log(name);

    const commandItem = await getCommandItem(name);
    if (!commandItem) {
        logger.debug(`No command item found named ${name}`);
        return res.status(400).send({
          error: "Unable to find command, see log for details.",
        });
    }
    console.log("Attempting to run command ", commandItem);
    const commandRunner = path.join(process.cwd(), "config", "commandrunner");
    var commandRunnerFile = createWriteStream(commandRunner);
    commandRunnerFile.write(`${commandItem.command}\n`)
    commandRunnerFile.close();

    const timeout = 10000;
    const outputPath = `./config/logs/output.txt`
    const fileExists = await checkFileExist(outputPath, timeout);

    if (fileExists) {
      const data = readFileSync(outputPath).toString()
      //unlinkSync(outputPath) //delete the output file
      console.log("Command output: ", data) //log the output of the command
      return res.status(200).json({
          status: `command '${commandItem.command}' completed`,
          output: data,
      }); 
    }
    else {
      return res.status(200).json({
        status: `command '${commandItem.command}' timed out after ${timeout} ms`,
      });
    }
}
