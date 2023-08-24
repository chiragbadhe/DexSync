import { useState, ReactNode, FC } from "react";

interface Tooltip {
  children: ReactNode;
  position?: string;
  content: any;
}

const ToolTip: FC<Tooltip> = ({ children, position, content }) => {
  const positionClass = (position: any) => {
    switch (position) {
      case "top":
        return "bottom-6 se-auto ";
      case "bottom":
        return "top-6 se-auto ";
      case "left":
        return "right-6 tb-auto ";
      case "right":
        return "left-6 tb-auto ";
      default:
        return "bottom-6  se-auto ";
    }
  };
  return (
    <div className="tooltip group relative flex  items-center  justify-center text-center">
      {children}
      <span
        className={`tooltip-content absolute block min-w-160  bg-black  p-2  opacity-0  group-hover:opacity-100 ${positionClass(
          position
        )}`}
      >
        {content}
      </span>
    </div>
  );
};

export default ToolTip;
