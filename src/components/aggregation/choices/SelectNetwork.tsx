import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import InputLabel from "@/components/common/InputLabel";
import { NetworksConfig } from "@/configs/networks";
import { useNetworkStore, useSwapStore } from "@/store/swap";
import useModal from "@/hooks/useModal";

import { ChevronDown, ChevronUp, Settings, X } from "lucide-react";
import Modal from "@/components/common/Modal";
import Setting from "./Setting";
import { useRouter } from "next/router";
import { getQuery } from "@/utils/common";

interface Network {
  value: number;
  label: string;
  logo: string;
}

const SelectNetwork = () => {
  const router = useRouter();
  const { setSelectedNetworkId } = useNetworkStore();
  const { resetToken0, resetToken1, resetAmount, resetSelectedQuote } =
    useSwapStore();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isShowing, toggle } = useModal();

  const [selectedNetwork, setSelectedNetwork] = useState<Network>({
    value: 0,
    label: "",
    logo: "",
  });

  const updateRoute = (name: string, value: number) => {
    router.replace({
      pathname: "/",
      query: {
        [name]: value,
      },
    });
  };
  useEffect(() => {
    const networks = NetworksConfig.map((network) => ({
      value: parseInt(network.chainId.toString()),
      label: network.name.toString(),
      logo: network.logo,
    }));
    setNetworks(networks);
    const queryChain = getQuery("chain");
    let sortNetwork: any = networks.filter(
      (event: any) => event.value === Number(queryChain)
    );
    if (queryChain && sortNetwork && sortNetwork.length) {
      setSelectedNetwork(sortNetwork[0]);
      setSelectedNetworkId(sortNetwork[0]?.value);
    } else {
      setSelectedNetwork(networks[0]);
      setSelectedNetworkId(networks[0]?.value);
      updateRoute("chain", networks[0]?.value);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setSelectedNetworkId]);

  const handleNetworkChange = (network: Network) => {
    updateRoute("chain", Number(network.value));
    setSelectedNetwork(network);
    setSelectedNetworkId(network.value);
    
    setIsDropdownOpen(false);
    resetToken0();
    resetToken1();
    resetAmount();
    resetSelectedQuote();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  return (
    <section>
      <div className="mb-[12px] flex items-center justify-between">
        <p className="">Select Network</p>
      </div>
      <div className="relative font-general-sans" ref={dropdownRef}>
        <button
          className=" flex w-full appearance-none justify-between  border border-gray-custom-200 bg-gray-custom-300 px-[16px] py-[12px]"
          type="button"
          onClick={toggleDropdown}
        >
          <span className="flex items-center">
            {selectedNetwork && (
              <Image
                className="h-5 w-5"
                src={selectedNetwork.logo}
                width="24"
                height="24"
                alt={selectedNetwork.label}
              />
            )}
            <span className="ml-2 w-full">
              {selectedNetwork && selectedNetwork.label}
            </span>
          </span>

          <span>
            {isDropdownOpen ? (
              <ChevronUp color="#C3C3C3" />
            ) : (
              <ChevronDown color="#C3C3C3" />
            )}
          </span>
        </button>
        {isDropdownOpen && (
          <div className="network-box-shadow absolute top-full z-10 mt-[3px] w-full  overflow-hidden border border-gray-custom-200 bg-gray-custom-100 ">
            {networks.map((network) => (
              <button
                key={network.value}
                className="w-full border-b border-white/5 px-[16px] py-[12px] text-left duration-300 hover:bg-[#1D1F21]  focus:bg-gray-custom-200 focus:text-black"
                type="button"
                onClick={() => handleNetworkChange(network)}
              >
                <div className="flex items-center">
                  <Image
                    src={network.logo}
                    width="24"
                    height="24"
                    alt={network.label}
                  />
                  <span className="ml-[8px] w-full">{network.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default SelectNetwork;
