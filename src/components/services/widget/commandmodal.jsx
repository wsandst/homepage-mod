import React, { useState } from "react";

export default function CommandModal({ show, cmd, setShow, onSubmitCallback }) {
  const fields = cmd == null ? [] : cmd.arguments;
  const title = cmd == null ? "" : `${cmd.group} - ${cmd.name}`
  const fieldValues = Array(fields.length);

  const onFieldChange = (index, value) => {
    console.log(index, value);
    fieldValues[index] = value;
  }

  return (
    <>
      {show ? (
        <div>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50"/>
          <div className="flex justify-center h-screen items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full min-w-[80%] max-w-[90%] md:min-w-[35%] md:max-w-[35%] text-theme-700 dark:text-theme-200 dark:hover:text-theme-300 shadow-md shadow-theme-900/10 dark:shadow-theme-900/20 bg-theme-50 dark:bg-theme-800">
              <div className="flex-col w-fullrounded-md p-0 block font-medium ">
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                  <h3 className="text-3xl font=semibold">{title}</h3>
                  <button
                    className="bg-transparent border-0 loat-right"
                    onClick={() => setShow(false)}
                  >
                    <span className="opacity-7 h-6 w-6 text-xl block  py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                  <form className="shadow-md rounded px-8 pt-6 pb-8 w-full">
                  {fields.map((fieldName, index) =>
                    <div className="m-2">
                      <label className="block text-sm font-bold mb-1">
                        {fieldName}
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                            onChange={(e) => onFieldChange(index, e.target.value)}
                      />
                    </div>
                  )}
                  </form>
                <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-white bg-red-500 active:bg-red-700 bfont-bold uppercase px-6 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setShow(false); 
                      onSubmitCallback(cmd, fieldValues)
                    }}
                  >
                    Run
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};