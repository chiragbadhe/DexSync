import Modal from "@/components/common/Modal";
import useModal from "@/hooks/useModal";
import { useLocalStorage } from "usehooks-ts";
import useAggregation from "@/hooks/useAggregation";
import { X } from "lucide-react";
import { Settings } from "lucide-react";
import { useState } from "react";
import { AggregatorName } from "@/store/quotes";
import { capitalize } from "@/utils";
const Setting = () => {
  const { isShowing, toggle } = useModal();
  const { applySetting } = useAggregation();

  const [unselectAggregators] = useLocalStorage("unselectAggregators", []);
  const aggregators: AggregatorName[] = [
    "MATCHA",
    "1INCH",
    "PARASWAP",
    "KYBERSWAP",
    "OPENOCEAN",
  ];
  const [unselectAggregatorsArray, setUnselectAggregatorsArray] = useState<any>(
    unselectAggregators || [null]
  );
  const toggleModal = () => {
    let getunselectAggregators = localStorage.getItem("unselectAggregators");
    let unselectAggregatorsObject = getunselectAggregators
      ? JSON.parse(getunselectAggregators)
      : [null];
    setUnselectAggregatorsArray(unselectAggregatorsObject);
    toggle();
  };
  const toggleCheckbox = (event: any) => {
    let { checked, value } = event.target;
    applySetting(checked, value);
    return (checked = !checked);
  };
  return (
    <>
      <div className="flex justify-center">
        <div className=" py-[30px] md:w-[660px] w-full">
          <div className="grid w-full grid-cols-2 md:grid-cols-3 gap-[12px]">
            {aggregators &&
              aggregators.map((aggregator, index) => {
                let isChecked =
                  unselectAggregatorsArray.filter(
                    (aggregators: string) =>
                      aggregators === aggregator.toString()
                  ).length === 0;

                return (
                  <>
                    <label
                      key={`${aggregator}-${index}`}
                      className="flex  cursor-pointer space-x-[12px] border border-gray-custom-200  bg-gray-custom-400 px-[15px] py-[15px]"
                      htmlFor={"aggregator_" + index}
                    >
                      <input
                        type="checkbox"
                        className="checkbox-input flex items-center justify-center"
                        id={"aggregator_" + index}
                        name={"aggregator_" + index}
                        value={aggregator}
                        defaultChecked={isChecked}
                        onClick={(event: any) => {
                          toggleCheckbox(event);
                        }}
                      />
                      <p className="">{capitalize(aggregator.toString())}</p>
                    </label>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Setting;
