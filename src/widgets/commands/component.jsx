import { useTranslation } from "next-i18next";
import useSWRMutation from 'swr'

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import BlockButton from "components/services/widget/blockbutton";
import useWidgetAPI from "utils/proxy/use-widget-api";

import { useState } from 'react';


const ButtonStates = {
  Idle: 0,
  Running: 1,
  Success: 2,
  Failure: 3
}

const ButtonStateColorMap = {
  0: null,
  1: "blue",
  2: "green",
  3: "rose"
}

async function runCommand(group, command, completeCallback) {
    console.log(`/api/commands?group=${group}&command=${command}`);
    var res = await fetch(`/api/commands?group=${group}&command=${command}`, {
      method: 'GET',
    })
    completeCallback(res.status == 200);
    console.log("Command result: ", res);
  }
  
export default function Component({ service }) {
    const { t } = useTranslation();

    const { widget } = service;

    const commandGroup = service.commandgroup;
    const buttonStates = widget.commands.map((cmd) => {
      const [state, setState] = useState(ButtonStates.Idle);
      return {state: state, setState: setState}
    });

    return (
        <Container service={service}>
        {widget.commands.map((cmd, i) =>
             <BlockButton key={cmd.name} 
                          running={buttonStates[i].state == ButtonStates.Running} 
                          outlineColor={ButtonStateColorMap[buttonStates[i].state]}
                          label={cmd.name} 
                          onClick={() => {
                            buttonStates[i].setState(ButtonStates.Running); 
                            runCommand(commandGroup, cmd.name, (success) =>  {
                                buttonStates[i].setState(success ? ButtonStates.Success : ButtonStates.Failure);
                            });
                          }} 
            />
        )}
        </Container>
    );Failure
}
