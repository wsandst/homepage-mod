import { useTranslation } from "next-i18next";
import classNames from "classnames";
import {Button} from "react"

export default function BlockButton({ value, label, onClick, running, outlineColor }) {
  const { t } = useTranslation();
  return (
    <button onClick={onClick}
      className={classNames(
        "bg-theme-200/50 dark:bg-theme-900/20 rounded m-1 flex-1 flex flex-col items-center justify-center text-center p-1  dark:hover:bg-white/10 transition ease-in-out "
        , running ? " animate-pulse" : ""
        , outlineColor != null ? `outline outline-2 outline-${outlineColor}-400` : "")}
    >
      <div className="font-bold flex-1 text-xs uppercase my-1.5">{t(label)}</div>
    </button>
  );
}
