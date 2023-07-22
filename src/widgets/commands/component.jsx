import { useTranslation } from "next-i18next";
import useSWRMutation from 'swr'

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import BlockButton from "components/services/widget/blockbutton";
import useWidgetAPI from "utils/proxy/use-widget-api";
import Modal from "components/services/widget/commandmodal";

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

async function runCommand(cmd, argumentValues, completeCallback) {
  let commandUrl = `/api/commands?group=${cmd.group}&command=${cmd.name}`;
  if (argumentValues != null) {
    commandUrl += "&arguments=" + argumentValues.map((value) => `"${value}"`).join(',')
  }
  console.log("Command api url:", commandUrl);
  let res = await fetch(commandUrl, {
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

  const [modalShowState, setModalShowState] = useState(false);
  const [modalCmdState, setModalCmdState] = useState(null);

  const commands = [];
  for (var i = 0; i < widget.commands.length; i+= 3) {
    commands.push(widget.commands.slice(i, i+3))
  }
  
  const onCommandButtonPress = (cmd, i) => {
    if (cmd.arguments) {
      setModalCmdState(cmd);
      setModalShowState(true);
    }
    else {
      buttonStates[i].setState(ButtonStates.Running); 
      runCommand(cmd, null, (success) =>  {
          buttonStates[i].setState(success ? ButtonStates.Success : ButtonStates.Failure);
      });
    }
  }

  const onArgumentsSubmitted = (cmd, values) => {
    runCommand(cmd, values, () => {});
  }

  return (
    <div>
      <Modal show={modalShowState} 
              cmd={modalCmdState} 
              setShow={setModalShowState} 
              onSubmitCallback={onArgumentsSubmitted} 
      />
      {commands.map((groupedCommands, j) =>
        <Container service={service}>
        {groupedCommands.map((cmd, i) =>
            <BlockButton key={cmd.name} 
                          running={buttonStates[j*3+i].state == ButtonStates.Running} 
                          outlineColor={ButtonStateColorMap[buttonStates[j*3+i].state]}
                          label={cmd.name} 
                          onClick={() => {
                            onCommandButtonPress(cmd, j*3+i)
                          }} 
            />
        )}
        </Container>
      )}
    </div>
  );
}
