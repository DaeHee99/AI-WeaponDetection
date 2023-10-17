import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  animation: boolean;
}

function ToastWrapper({ children, animation }: Props) {
  return (
    <div
      className={`flex items-center w-full p-4 text-gray-500 bg-white rounded-lg transition-transform duration-700 ease-in-out ${
        animation ? "translate-x-0" : "translate-x-[500px]"
      }`}
    >
      {children}
    </div>
  );
}

export default ToastWrapper;
