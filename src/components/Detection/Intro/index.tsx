import IntroWrapper from "./IntroWrapper";
import MainImage from "./MainImage";
import Title from "./Title";
import Button from "./Button";

interface Props {
  showCam: boolean;
  clickHandler: () => void;
  step: number;
  showDot: boolean;
}

function Intro({ showCam, clickHandler, step, showDot }: Props) {
  return (
    <IntroWrapper showCam={showCam}>
      <MainImage />
      <Title />
      <Button clickHandler={clickHandler} step={step} showDot={showDot} />
    </IntroWrapper>
  );
}

export default Intro;
