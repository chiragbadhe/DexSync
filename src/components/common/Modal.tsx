import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
  children?: ReactNode;
  headpart?: ReactNode;
  title?: string;
  className?: string;
  isShowing: boolean;
  hide: any;
}
const Modal: FC<ModalProps> = ({
  title,
  children,
  headpart,
  className,
  isShowing,
  hide,
}) => {
  const onOutsideClickHandler = (event: any) => {
    !event.target.closest(".dialog-panel-body") && hide();
  };
  return (
    <>
      <Transition show={isShowing} as={"div"}>
        <Dialog className="relative z-50" static onClose={() => null}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-[15px]" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              as="div"
              className="dialog-panel fixed inset-0 flex items-center justify-center p-4"
              onClick={(event: any) => onOutsideClickHandler(event)}
            >
              <div
                className={`dialog-panel-body h-[80vh] fixed mx-auto overflow-y-scroll border border-white/10 bg-[#1A1D1F] p-[16px] ${className}`}
              >
                {title && (
                  <Dialog.Title className="mb-3 text-start text-base font-medium">
                    {title}
                  </Dialog.Title>
                )}

                <div className="px-[16px]">{headpart}</div>
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
export default Modal;
