import { useState } from "react";
import Detection from "./components/Detection";
import Header from "./components/Header";

function App() {
  const [showCam, setShowCam] = useState(false);

  return (
    <>
      {showCam && <Header />}
      <Detection showCam={showCam} setShowCam={setShowCam} />
    </>
  );
}

export default App;
