import { useTranslation } from "next-i18next";
import useSWRMutation from 'swr'

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import BlockButton from "components/services/widget/blockbutton";
import useWidgetAPI from "utils/proxy/use-widget-api";


// Fetcher implementation.
// The extra argument will be passed via the `arg` property of the 2nd parameter.
// In the example below, `arg` will be `'my_token'`
async function runCommand(group, command) {
    var res = await fetch(`/api/commands?group=${group}&command=${command}`, {
      method: 'GET',
    })
    console.log(res);
  }
  
export default function Component({ service }) {
    const { t } = useTranslation();

    const { widget } = service;

    //const { data: statsData, error: statsError } = useWidgetAPI(widget, "device");
    console.log(service);

    //const { data: statsData, error: statsError } = useSWR(`/api/commands?/${widget.container}/${widget.server || ""}`);
    //const { data: statsData, error: statsError } = useWidgetAPI(widget, "device");

    const commandGroup = service.commandgroup;
    //const { trigger } = useSWRMutation('/api/commands', runCommand)

    return (
        <Container service={service}>
        {widget.commands.map((cmd) =>
             <BlockButton label={cmd.name} onClick={() => runCommand(commandGroup, cmd.name)} />
        )}
        </Container>
    );
}
