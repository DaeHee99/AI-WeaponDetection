import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function HeaderWrapper({ children }: Props) {
  return (
    <header className="fixed w-full z-40 top-0 left-0 bg-white border border-b-blue-300 shadow p-4 flex justify-center items-center gap-5">
      {children}
    </header>
  );
}

export default HeaderWrapper;
