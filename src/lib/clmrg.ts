import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function clmrg(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}
