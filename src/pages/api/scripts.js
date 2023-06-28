import { performance } from "perf_hooks";

import { getScriptItem } from "utils/config/script-helpers";
import createLogger from "utils/logger";
import { httpProxy } from "utils/proxy/http";

import { promises as fs, createWriteStream } from "fs";
import path from "path";

import yaml from "js-yaml";

import checkAndCopyConfig, { substituteEnvironmentVars } from "utils/config/config";


const logger = createLogger("scripts");

export default async function handler(req, res) {
    const { script } = req.query;
    console.log(script);

    const serviceItem = await getScriptItem(script);
    if (!serviceItem) {
        logger.debug(`No script item found named ${script}`);
        return res.status(400).send({
          error: "Unable to find service, see log for details.",
        });
    }

    const scriptRunner = path.join(process.cwd(), "config", "scriptrunner");
    var scriptRunnerFile = createWriteStream(scriptRunner);
    setInterval( ()=> {
        console.log("Sending to pipe!");
        scriptRunnerFile.write(`hello at ${process.hrtime()[0]}\n`)
    }, 1000);
    //scriptRunnerFile.pipe("hello");
    //"hello".pipe(scriptRunnerFile);

    const { ping: pingURL } = serviceItem;

    if (!pingURL) {
        logger.debug("No ping URL specified");
        return res.status(400).send({
        error: "No ping URL given",
        });
    }

    try {
      let startTime = performance.now();
      let [status] = await httpProxy(pingURL, {
        method: "HEAD"
      });
      let endTime = performance.now();
      
      if (status > 403) {
        // try one more time as a GET in case HEAD is rejected for whatever reason
        startTime = performance.now();
        [status] = await httpProxy(pingURL);
        endTime = performance.now();
      }
  
      return res.status(200).json({
        status,
        latency: endTime - startTime
      });
    } catch (e) {
      logger.debug("Error attempting ping: %s", JSON.stringify(e));
      return res.status(400).send({
        error: 'Error attempting ping, see logs.',
      });
    }
}
