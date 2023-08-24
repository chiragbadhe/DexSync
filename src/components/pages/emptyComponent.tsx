/* eslint-disable @next/next/no-img-element */
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

interface EmptyTypes {
  heading: string;
  desc: string;
  buttontext?: string;
  image: string;
  onClick?: () => void;
}

const EmptyComponent = ({
  heading,
  desc,
  buttontext,
  image,
  onClick,
}: EmptyTypes) => {
  const { isConnected } = useAccount();

  return (
    <div className="flex h-[650px] w-full items-center justify-center">
      <div className="flex max-w-[400px] flex-col items-center p-[30px]">
        <span>
          <img src={image} alt="" />
        </span>
        <span className="pt-[22px] font-general-sans text-[24px] font-medium">
          {heading}
        </span>
        <span className="mt-[4px] max-w-[260px] text-center font-general-sans text-[16px] text-[#6F767E] ">
          {desc}
        </span>
        {buttontext &&
          (isConnected ? (
            <a
              href="https://forms.gle/xp1HiDkBDFesoTr57"
              target="_blank"
              rel="noreferrer"
            >
              <button className="mt-[20px] w-[340px]  border border-[#60B5A0] bg-[#6F3CE4] px-[16px] py-[12px]">
                {buttontext}
              </button>
            </a>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => {
                return (
                  <button
                    className="mt-[20px] w-[340px]  border border-[#60B5A0] bg-[#6F3CE4] px-[16px] py-[12px]"
                    onClick={show}
                  >
                    {buttontext}
                  </button>
                );
              }}
            </ConnectKitButton.Custom>
          ))}
      </div>
    </div>
  );
};

export default EmptyComponent;
