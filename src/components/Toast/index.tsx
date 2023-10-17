import { useEffect, useState } from "react";

interface Props {
  message: string;
}

function Toast({ message }: Props) {
  const [animation, setAnimation] = useState(false);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (!showToast) return setAnimation(false);
    setTimeout(() => setAnimation(true), 60);

    setTimeout(() => {
      setAnimation(false);
    }, 6000);

    setTimeout(() => {
      setShowToast(false);
    }, 6760);
  }, [showToast]);

  if (!showToast) return null;
  return (
    <div
      className={`flex items-center w-full p-4 text-gray-500 bg-white rounded-lg transition-transform duration-700 ease-in-out ${
        animation ? "translate-x-0" : "translate-x-[500px]"
      }`}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      </div>
      <div className="ml-3 font-body4-regular text-grey-400">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
        onClick={() => {
          setAnimation(false);
        }}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
