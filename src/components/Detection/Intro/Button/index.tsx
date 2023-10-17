import Dot from "./Dot";
import Text from "./Text";

interface Props {
  clickHandler: () => void;
  step: number;
  showDot: boolean;
}

function Button({ clickHandler, step, showDot }: Props) {
  return (
    <button
      className="relative px-4 py-2 leading-6 text-sm shadow rounded-md text-sky-500 bg-white ring-1 hover:bg-sky-400 hover:text-white"
      onClick={clickHandler}
    >
      <Text step={step} />
      <Dot showDot={showDot} />
    </button>
  );
}

export default Button;
