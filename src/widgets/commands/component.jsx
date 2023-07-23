import Container from "components/services/widget/container";
import BlockButton from "components/services/widget/blockbutton";
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

// Run a command by calling the 'command' api endpoint, which allows
// for the execution of predefined commands in the 'commands.yaml' config file
async function runCommand(cmd, argumentValues, completeCallback) {
  let commandUrl = `/api/commands?group=${cmd.group}&command=${cmd.name}`;
  if (argumentValues != null) {
    commandUrl += "&args=" + argumentValues.map((value) => `"${value}"`).join(',')
  }
  console.log("Command api url:", commandUrl);
  let res = await fetch(commandUrl, {
    method: 'GET',
  })
  completeCallback(res.status == 200);
  console.log("Command result: ", res);
}
  
export default function Component({ service }) {
  const { widget } = service;
  const commandGroup = service.commandgroup;

  // Setup various states
  const buttonStates = widget.commands.map((cmd) => {
    const [state, setState] = useState(ButtonStates.Idle);
    return {state: state, setState: setState}
  });

  const [modalShowState, setModalShowState] = useState(false);
  const [modalCmdState, setModalCmdState] = useState(null);

  // Create rows of commands matching the optional service 'rows' attribute
  // Defaults to 3 buttons per row
  const commands = [];
  const buttonsPerRow = service.rows == null ? 3 : service.rows;
  for (var i = 0; i < widget.commands.length; i+= buttonsPerRow) {
    commands.push(widget.commands.slice(i, i+buttonsPerRow))
  }
  
  // Handle a command button being pressed
  const onCommandButtonPress = (cmd, i) => {
    if (cmd.arguments) {
      // If the command requires arguments, provide a modal which allows for
      // input of these arguments
      cmd.index = i;
      setModalCmdState(cmd);
      setModalShowState(true);
    }
    else {
      // Otherwise, just run the command
      buttonStates[i].setState(ButtonStates.Running); 
      runCommand(cmd, null, (success) =>  {
        buttonStates[i].setState(success ? ButtonStates.Success : ButtonStates.Failure);
      });
    }
  }

  const onArgumentsSubmitted = (cmd, values) => {
    // Callback from the arguments modal, once the arguments have been inputted
    buttonStates[cmd.index].setState(ButtonStates.Running); 
    runCommand(cmd, values, (success) =>  {
      buttonStates[cmd.index].setState(success ? ButtonStates.Success : ButtonStates.Failure);
  });
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
                          running={buttonStates[j*buttonsPerRow+i].state == ButtonStates.Running} 
                          outlineColor={ButtonStateColorMap[buttonStates[j*buttonsPerRow+i].state]}
                          label={cmd.name} 
                          onClick={() => {
                            onCommandButtonPress(cmd, j*buttonsPerRow+i)
                          }} 
            />
        )}
        </Container>
      )}
    </div>
  );
}
