/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { FC, useState } from "react";

interface ImageWithSymbolText {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  textSymbolShowOnError?: boolean;
  errorSymbolClassName?: string;
}

const ImageWithSymbolText: FC<ImageWithSymbolText> = ({
  src,
  className,
  width,
  height,
  alt,
  errorSymbolClassName,
  textSymbolShowOnError,
}) => {
  const [isError, setIsError] = useState(false);
  return (
    <>
      {!isError && src ? (
        <img
          src={src}
          width={width}
          height={height}
          alt={alt}
          onError={() => {
            setIsError(true);
          }}
          className={className}
        />
      ) : textSymbolShowOnError ? (
        alt && <div className={errorSymbolClassName}>{alt.substring(0, 3)}</div>
      ) : null}
    </>
  );
};
export default ImageWithSymbolText;
