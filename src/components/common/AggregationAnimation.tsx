/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";

type Props = {};

function AggregationAnimation({}: Props) {
  return (
    <div className=" relative flex items-start justify-center">
      <div className="relative flex h-full w-full items-start justify-center">
        <img className="" src="/AggregationAnimation/bg.svg" alt="" />
        <img
          className="rotate-innercircle absolute"
          src="/AggregationAnimation/circularImages.svg"
          alt=""
        />
      </div>
    </div>
  );
}

export default AggregationAnimation;
