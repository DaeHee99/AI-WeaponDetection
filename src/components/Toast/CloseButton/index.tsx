import CloseIcon from "./CloseIcon";

interface Props {
  setAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

function CloseButton({ setAnimation }: Props) {
  return (
    <button
      type="button"
      className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
      onClick={() => {
        setAnimation(false);
      }}
    >
      <CloseIcon />
    </button>
  );
}

export default CloseButton;
