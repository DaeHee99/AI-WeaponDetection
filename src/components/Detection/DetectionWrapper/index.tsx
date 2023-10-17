import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  danger: boolean;
}

function DetectionWrapper({ children, danger }: Props) {
  return (
    <div
      className={`w-full h-screen flex justify-center items-center pt-[73px] ${
        danger ? "bg-[#C4302B]" : "bg-gray-100"
      }`}
    >
      {children}
    </div>
  );
}

export default DetectionWrapper;
