import knifeMan from "../../assets/images/knife_man.png";

function Header() {
  return (
    <header className="fixed w-full z-40 top-0 left-0 bg-white border border-b-blue-300 shadow p-4 flex justify-center items-center gap-5">
      <img src={knifeMan} alt="logo" className="w-10 h-10" />
      <div className="text-center text-2xl">위험 물체 탐지 프로그램</div>
    </header>
  );
}

export default Header;
