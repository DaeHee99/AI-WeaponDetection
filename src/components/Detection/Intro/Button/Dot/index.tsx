interface Props {
  showDot: boolean;
}

function Dot({ showDot }: Props) {
  if (!showDot) return null;
  return (
    <span className="absolute -top-1 -right-1">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
      </span>
    </span>
  );
}

export default Dot;
