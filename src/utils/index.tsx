import { Token } from "@/store/swap";

export const isEmptyObject = (obj: Object) => {
  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const isNativeToken = (token: Token): boolean => {
  return (
    token.address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  );
};

export const toHexString = (str: string) => {
  var hex = "";
  for (var i = 0, l = str.length; i < l; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
};
