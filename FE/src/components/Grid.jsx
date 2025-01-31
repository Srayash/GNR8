import { useRecoilValue } from "recoil";
import { errorStateAtom } from "../store/atoms/errorState";

export function Grid() {

  const errorState = useRecoilValue(errorStateAtom);

  return (
    <div className="h-full w-full dark:bg-theme-black fixed -z-10 flex items-center justify-center overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle,_rgba(121,118,118,0.5)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 pointer-events-none dark:bg-theme-black [mask-image:radial-gradient(circle,transparent_20%,black)] [webkit-mask-image:radial-gradient(circle,transparent_20%,black)]"></div>
    </div>
  );
}