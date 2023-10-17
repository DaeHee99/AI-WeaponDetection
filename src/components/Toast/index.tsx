import { useEffect, useState } from "react";
import ToastWrapper from "./ToastWrapper";
import WarningIcon from "./WarningIcon";
import WarningMessage from "./WarningMessage";
import CloseButton from "./CloseButton";

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
    <ToastWrapper animation={animation}>
      <WarningIcon />
      <WarningMessage message={message} />
      <CloseButton setAnimation={setAnimation} />
    </ToastWrapper>
  );
}

export default Toast;
