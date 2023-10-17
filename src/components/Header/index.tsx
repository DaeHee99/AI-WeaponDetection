import HeaderWrapper from "./HeaderWrapper";
import Logo from "./Logo";
import Title from "./Title";
import QuitButton from "./QuitButton";

function Header() {
  return (
    <HeaderWrapper>
      <Logo />
      <Title />
      <QuitButton />
    </HeaderWrapper>
  );
}

export default Header;
