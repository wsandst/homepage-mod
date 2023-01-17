import getServiceWidget from "utils/config/service-helpers";
import { formatApiCall } from "utils/proxy/api-helpers";
import validateWidgetData from "utils/proxy/validate-widget-data";
import { httpProxy } from "utils/proxy/http";
import createLogger from "utils/logger";
import widgets from "widgets/widgets";

const logger = createLogger("octoPrintProxyHandler");

export default async function octoPrintProxyHandler(req, res, map) {
  const { group, service, endpoint } = req.query;

  if (group && service) {
    const widget = await getServiceWidget(group, service);

    if (!widgets?.[widget.type]?.api) {
      return res.status(403).json({ error: "Service does not support API calls" });
    }

    if (widget) {
      const url = new URL(formatApiCall(widgets[widget.type].api, { endpoint, ...widget }));

      const [status, contentType, data] = await httpProxy(url, {
        method: req.method,
      });

      let resultData = data;

      if (!validateWidgetData(widget, endpoint, resultData)) {
        if ((status === 500 || status === 502 || status === 409) && widget.silencePrinterNotFound) {
          resultData = { state: { text: "Not found" } };
          return res.status(status).send(resultData);
        }
        return res.status(status).json({ error: { message: "Invalid data", url, data: resultData } });
      }

      if (status === 200 && map) {
        resultData = map(data);
      }

      if (contentType) res.setHeader("Content-Type", contentType);

      if (status === 204 || status === 304) {
        return res.status(status).end();
      }

      if (status >= 400) {
        logger.debug("HTTP Error %d calling %s//%s%s...", status, url.protocol, url.hostname, url.pathname);
        return res.status(status).json({ error: { message: "HTTP Error", url, data } });
      }

      return res.status(status).send(resultData);
    }
  }

  logger.debug("Invalid or missing proxy service type '%s' in group '%s'", service, group);
  return res.status(400).json({ error: "Invalid proxy service type" });
}
