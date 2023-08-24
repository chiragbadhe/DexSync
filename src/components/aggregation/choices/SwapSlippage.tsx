import { FC, useState } from "react";
import InputLabel from "@/components/common/InputLabel";
import { useSwapStore } from "@/store/swap";
import { toast } from "react-toastify";

interface PredefinedOptionProps {
  percentage: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const PredefinedOption: FC<PredefinedOptionProps> = ({
  percentage,
  isSelected,
  onClick,
}) => {
  return (
    <div>
      <div
        className={`text  bg-gray-custom-200 px-[16px] py-[12px] text-center shadow ${
          isSelected ? "border-purple-light border" : ""
        }`}
        onClick={onClick}
      >
        {percentage} %
      </div>
    </div>
  );
};

const SwapSlippage = () => {
  const { slippage, setSlippage } = useSwapStore();
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  const setSlippageValue = (value: number) => {
    setIsCustomSelected(false);
    setSlippage(value);
  };

  const handleButtonClick = (value: number) => {
    setSelectedButton(value);
    setSlippageValue(value);
  };

  return (
    <section className="space-y-[12px]">
      <InputLabel label="Swap Slippage" fontClass="" />

      <div className="grid grid-cols-4 gap-[12px] justify-between  font-dm-mono text-[13px] md:text-[16px]">
        <div className="w-full cursor-pointer ">
          <PredefinedOption
            percentage={0.1}
            isSelected={slippage === 0.1}
            onClick={() => handleButtonClick(0.1)}
          />
        </div>

        <div className="w-full cursor-pointer ">
          <PredefinedOption
            percentage={0.5}
            isSelected={slippage === 0.5}
            onClick={() => handleButtonClick(0.5)}
          />
        </div>

        <div className="w-full cursor-pointer ">
          <PredefinedOption
            percentage={1}
            isSelected={slippage === 1}
            onClick={() => handleButtonClick(1)}
          />
        </div>

        <div
          className={`text w-full cursor-pointer  bg-gray-custom-200 px-[16px] py-[12px] text-center  ${
            isCustomSelected ? "border-purple-light border" : ""
          }`}
          onClick={() => {
            setSelectedButton(null);
            setIsCustomSelected(true);
            setSlippage(0);
          }}
        >
          Custom
        </div>
      </div>

      <div className="flex w-full">
        <div className=" flex w-full  border border-gray-custom-200 ">
          <input
            type="number"
            value={slippage.toString()}
            className={`${
              !isCustomSelected ? "cursor-not-allowed" : "cursor-text"
            } w-full  bg-gray-custom-300 p-2 pl-4  font-dm-mono font-bold shadow focus:outline-none`}
            onChange={(event) => {
              setSelectedButton(null);
              setIsCustomSelected(true);
              setSlippage(Number(event.target.value));
            }}
            placeholder="0.0"
            min={0}
          />
          <span className="w-[69px] border-l border-gray-custom-200  bg-gray-custom-300 px-[16px] py-[13px] text-center ">
            %
          </span>
        </div>
      </div>
    </section>
  );
};

export default SwapSlippage;
