function QuitButton() {
  return (
    <button
      className="fixed top-4 right-10 px-6 py-2 leading-6 text-sm shadow rounded-md text-red-500 bg-white ring-1 ring-red-500 hover:bg-red-400 hover:text-white"
      onClick={() => {
        location.reload();
      }}
    >
      종료
    </button>
  );
}

export default QuitButton;
