import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import { FaTimes } from "react-icons/fa";

export default function CommandModal({ show, cmd, setShow, onSubmitCallback }) {
  const title = cmd == null ? "" : `${cmd.group} - ${cmd.name}`

  const [formFields, setFormFields] = useState([]);

  const onFieldChange = (index, value) => {
    formFields[index].value = value;
    setFormFields(formFields);
  }

  useEffect(() => {
    const fields = cmd == null ? [] : cmd.arguments;
    setFormFields(fields.map((f) => ({name: f, value: ''})));
  }, [cmd]);

  // Transition animation handling
  const [isInvisible, setIsInvisible] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  useEffect(() => {
    if (show && isHidden && isInvisible) {
      setIsHidden(false);
      setTimeout(() => setIsInvisible(false), 100);
    }
    else if (!show && !isHidden && !isInvisible) {
      setIsInvisible(true);
      setTimeout(() => {setIsHidden(true); setShow(false)}, 300);
    }

  }, [isInvisible, isHidden, show, setShow]);


  return (
    <div className={classNames(
      "relative z-20 ease-in-out duration-300 transition-opacity",
      isInvisible && "opacity-0",
      !isInvisible && !isHidden && "opacity-100",
      isHidden && "hidden",
    )} role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50"/>
      <div className="flex justify-center h-screen items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative rounded w-full min-w-[80%] max-w-[90%] md:min-w-[35%] md:max-w-[35%] text-theme-700 dark:text-theme-200 dark:hover:text-theme-300 shadow-md shadow-theme-900/10 dark:shadow-theme-900/20 bg-theme-50 dark:bg-theme-800">
          <div className="flex-col w-fullrounded-md p-0 block font-medium ">
            <div className="flex items-center justify-between p-5 pr-7 pl-7 border-b border-solid rounded-t">
              <h3 className="text-3xl font=semibold">{title}</h3>
              <button type='button'
                className="bg-transparent border-0 loat-right"
                onClick={() => { 
                  setShow(false);
                }}
              >
              <FaTimes className="text-theme-800 dark:text-theme-200 w-5 h-5"/>
              </button>
              
            </div>
              <form className="shadow-md rounded px-8 pt-6 pb-8 w-full">
              {formFields.map((field, index) => 
                <div className="m-2" key={field.name}>
                  <label htmlFor={`args-input-${field.name}`}>
                    <div className="block text-sm font-bold mb-1">                    
                      {field.name}
                    </div>
                    <input id={`args-input-${field.name}`} type="text" className="shadow appearance-none rounded w-full py-2 px-2 bg-theme-50 dark:bg-white/10"
                      onChange={(e) => onFieldChange(index, e.target.value)}
                    />
                  </label>
                </div>
              )}
              </form>
            <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-white bg-red-500 font-bold hover:bg-red-400 bfont-bold uppercase px-6 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => { 
                  setShow(false);
                }}
              >
                Cancel
              </button>
              <button
                className="text-white bg-blue-500 hover:bg-blue-400 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => {
                  setShow(false);
                  onSubmitCallback(cmd, formFields.map((f) => f.value))
                }}
              >
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};