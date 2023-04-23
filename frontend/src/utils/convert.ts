import { constants } from "../variables";

const { DNF, DNF_FOR_CALC, DNS, DNS_FOR_CALC } = constants;

export const convertTimeStringToTimeInt = (timeStr: string, calcTime = false) => {
  let dnf = DNF;
  let dns = DNS;
  if (calcTime) {
    dnf = DNF_FOR_CALC;
    dns = DNS_FOR_CALC;
  }
  const splitStr = timeStr.split(":");
  let num = 0;
  if (splitStr.length === 1) {
    const timeNum = Number(timeStr);
    if (timeNum < 0) {
      if (timeNum === DNF) {
        return dnf;
      } else if (timeNum === DNS) {
        return dns;
      }
    }
    num = Math.floor(Number(timeStr) * 1000);
  } else {
    const minToSec = Math.floor(Number(splitStr[0]) * 60000);
    num = Math.floor(Number(splitStr[1]) * 1000) + minToSec;
  }
  return num;
};

export const convertTimeIntToTimeStringForCopy = (timeInt: number) => {
  if (timeInt < 0) return String(timeInt);
  const seconds = timeInt / 1000;
  const formattedSeconds = Math.round(seconds * 100) / 100;
  const s = String(formattedSeconds).split(".")[0].padStart(2, "0");
  const ms = String(formattedSeconds).split(".")[1].padEnd(2, "0");
  return `${s}.${ms}`;
};

export const convertTimeIntToTimeString = (timeInt: number, input = false) => {
  if (timeInt === DNF) return input ? "-1" : "DNF";
  else if (timeInt === DNS) return input ? "-2" : "DNS";
  let seconds = timeInt / 1000;
  seconds = Math.round(seconds * 100) / 100;
  const min = Math.floor(seconds / 60);
  let s = "";
  if (min === 0) s = String(Math.floor(seconds % 60));
  else s = String(Math.floor(seconds % 60)).padStart(2, "0");
  const ms = String(seconds).split(".")[1].padEnd(2, "0");
  let minString = "";
  if (min !== 0) minString = `${min}:`;
  return `${minString}${s}.${ms}`;
};
