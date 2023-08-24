import { FC } from "react";
import { SuccessIcon, ErrorIcon } from "./Icons";

interface TransactionToastProps {
  link: string;
  title: string;
  type?: string;
}

export const TransactionToast: FC<TransactionToastProps> = ({
  link,
  title,
  type,
}) => {
  const Icon = (type: any) => {
    switch (type) {
      case "success":
        return <SuccessIcon width="20" height="20" color="#6F3CE4" />;
      case "error":
        return <ErrorIcon width="20" height="20" color="#ef4444" />;
      default:
        return <SuccessIcon width="20" height="20" color="#58A833" />;
    }
  };
  return (
    <>
      <div className="flex w-full space-x-2">
        <span className="mt-[2px]">{Icon(type)}</span>
        <div className="flex flex-col">
          <p className="text-white">{title}</p>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-sm text-[#6F3CE4]"
          >
            View Transaction
          </a>
        </div>
      </div>
    </>
  );
};
