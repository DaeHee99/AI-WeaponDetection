interface Props {
  message: string;
}

function WarningMessage({ message }: Props) {
  return <div className="ml-3 font-body4-regular text-grey-400">{message}</div>;
}

export default WarningMessage;
