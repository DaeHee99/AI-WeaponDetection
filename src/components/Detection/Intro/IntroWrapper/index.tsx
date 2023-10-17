import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  showCam: boolean;
}

function IntroWrapper({ children, showCam }: Props) {
  return (
    <div
      className={`${
        showCam ? "hidden" : "block"
      } border border-blue-300 shadow bg-white rounded-md p-4 max-w-lg w-full mx-auto flex flex-col gap-10`}
    >
      {children}
    </div>
  );
}

export default IntroWrapper;
