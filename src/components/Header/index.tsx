import knifeMan from "../../assets/images/knife_man.png";

function Header() {
  return (
    <header className="fixed w-full z-40 top-0 left-0 bg-white border border-b-blue-300 shadow p-4 flex justify-center items-center gap-5">
      <img src={knifeMan} alt="logo" className="w-10 h-10" />
      <div className="text-center text-2xl">위험 물체 탐지 프로그램</div>

      <button
        className="fixed top-4 right-10 px-6 py-2 leading-6 text-sm shadow rounded-md text-red-500 bg-white ring-1 ring-red-500 hover:bg-red-400 hover:text-white"
        onClick={() => {
          location.reload();
        }}
      >
        종료
      </button>
    </header>
  );
}

export default Header;
