import { useState, useEffect, useRef } from "react";
import knifeMan from "../../assets/images/knife_man.png";
import beep from "../../assets/audios/beep.mp3";
import Toast from "../Toast";

const colorList = [
  "#C7FC00",
  "#FF00FF",
  "#8622FF",
  "#FE0056",
  "#00FFCE",
  "#FF8000",
  "#00B7EB",
  "#FFFF00",
  "#0E7AFE",
  "#FFABAB",
  "#0000FF",
  "#CCCCCC",
];

interface Props {
  showCam: boolean;
  setShowCam: React.Dispatch<React.SetStateAction<boolean>>;
}

function Detection({ showCam, setShowCam }: Props) {
  const WIDTH = window.innerWidth > 640 ? 640 : window.innerWidth;
  const HEIGHT = WIDTH * 0.75;
  const [audio] = useState(new Audio(beep));
  const [model, setModel] = useState<any>(null);
  const [boundingBoxColors, setBoundingBoxColors] = useState({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [danger, setDanger] = useState(false);
  const [step, setStep] = useState(0);
  const [showDot, setShowDot] = useState(true);
  const [toastList, setToastList] = useState([""]);
  const [catchItem, setCatchItem] = useState("");
  const [toastDelay, setToastDelay] = useState(false);

  const getModel = async () => {
    const model = await window.roboflow
      .auth({
        publishable_key: "rf_c77RUyvX4YVQErgMejdnDHPD61d2",
      })
      .load({
        model: "weapondetection-ipjj1",
        version: 2,
      });

    setTimeout(() => {
      setModel(model);
      setStep(2);
      setShowDot(true);
    }, 3000);
  };

  useEffect(() => {
    danger ? audio.play() : audio.pause();
  }, [danger]);

  function getCoordinates(img: any) {
    const dWidth = window.innerWidth;
    const dHeight = window.innerHeight;
    const sWidth = 0;
    const sHeight = 0;
    const imageWidth = img.width;
    const imageHeight = img.height;

    const canvasRatio = dWidth / dHeight;
    const imageRatio = imageWidth / imageHeight;

    let sy: any;
    let sx: any;

    if (canvasRatio >= imageRatio) {
      sx = 0;
      sy = (imageHeight - sHeight) / 2;
    } else {
      sy = 0;
      sx = (imageWidth - sWidth) / 2;
    }

    let scalingRatio = dWidth / sWidth;
    if (scalingRatio == Infinity) scalingRatio = 1;
    return [sx, sy, scalingRatio];
  }

  function drawBoundingBoxes(
    predictions: any,
    ctx: any,
    scalingRatio: any,
    sx: any,
    sy: any
  ) {
    for (let i = 0; i < predictions.length; i++) {
      const confidence = predictions[i].confidence;
      ctx.scale(1, 1);

      if (predictions[i].class in boundingBoxColors) {
        ctx.strokeStyle =
          boundingBoxColors[
            predictions[i].class as keyof typeof boundingBoxColors
          ];
      } else {
        const color = colorList[Math.floor(Math.random() * colorList.length)];
        ctx.strokeStyle = color;
        colorList.splice(colorList.indexOf(color), 1);

        const NewBoundingBoxColors: { [key: string]: string } = {
          ...boundingBoxColors,
        };
        NewBoundingBoxColors[
          predictions[i].class as keyof typeof boundingBoxColors
        ] = color;
        setBoundingBoxColors(NewBoundingBoxColors);
      }

      const prediction = predictions[i];
      let x = prediction.bbox.x - prediction.bbox.width / 2;
      let y = prediction.bbox.y - prediction.bbox.height / 2;
      let width = prediction.bbox.width;
      let height = prediction.bbox.height;

      x -= sx;
      y -= sy;
      x *= scalingRatio;
      y *= scalingRatio;
      width *= scalingRatio;
      height *= scalingRatio;

      if (x < 0) {
        width += x;
        x = 0;
      }

      if (y < 0) {
        height += y;
        y = 0;
      }

      ctx.rect(x, y, width, width);
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fill();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = "4";
      ctx.strokeRect(x, y, width, height);

      const text = ctx.measureText(
        prediction.class + " " + Math.round(confidence * 100) + "%"
      );

      if (y < 20) {
        y = 30;
      }

      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(x - 2, y - 30, text.width + 4, 30);
      ctx.font = "15px monospace";
      ctx.fillStyle = "black";

      ctx.fillText(
        prediction.class + " " + Math.round(confidence * 100) + "%",
        x,
        y - 10
      );
    }
  }

  useEffect(() => {
    if (!model) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        setShowCam(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        video.srcObject = stream;
        video?.play();

        const ctx = canvas.getContext("2d");
        ctx?.scale(1, 1);

        video.addEventListener(
          "loadeddata",
          () => {
            setInterval(() => {
              const [sx, sy, scalingRatio] = getCoordinates(video);
              model.detect(video).then((predictions: any) => {
                for (let i = 0; i < predictions.length; i++) {
                  if (predictions[i].class === "mobile-phone") {
                    setCatchItem(predictions[i].class);
                    setDanger(true);
                    break;
                  }
                  if (i === predictions.length - 1) {
                    setDanger(false);
                    setCatchItem("");
                  }
                }
                if (predictions.length === 0) {
                  setDanger(false);
                  setCatchItem("");
                }

                ctx?.drawImage(video, 0, 0, WIDTH, HEIGHT);

                ctx?.beginPath();

                drawBoundingBoxes(predictions, ctx, scalingRatio, sx, sy);
              });
            }, 1000 / 30);
          },
          false
        );
      });
  }, [model]);

  useEffect(() => {
    if (catchItem === "" || toastDelay) return;

    setToastList([
      ...toastList,
      `위험 물체 ${catchItem}이(가) 감지되었습니다.`,
    ]);

    setToastDelay(true);
    setTimeout(() => {
      setToastDelay(false);
    }, 3000);
  }, [catchItem]);

  const clickHandler = () => {
    if (step !== 0) return;

    setStep(1);
    setShowDot(false);
    getModel();
    audio.loop = true;
  };

  return (
    <>
      <div
        className={`w-full h-screen flex justify-center items-center pt-[73px] ${
          danger ? "bg-[#C4302B]" : "bg-gray-100"
        }`}
      >
        <div
          className={`${
            showCam ? "hidden" : "block"
          } border border-blue-300 shadow bg-white rounded-md p-4 max-w-lg w-full mx-auto flex flex-col gap-10`}
        >
          <img src={knifeMan} alt="logo" className="w-2/3 mx-auto mt-5" />
          <div className="text-center text-2xl">위험 물체 탐지 프로그램</div>

          <button
            className="relative px-4 py-2 leading-6 text-sm shadow rounded-md text-sky-500 bg-white ring-1 hover:bg-sky-400 hover:text-white"
            onClick={clickHandler}
          >
            {step === 0 ? (
              <span>시작하기</span>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="inline w-5 h-5 mr-2 text-gray-200 animate-spin fill-sky-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <div>
                  {step === 1
                    ? "모델을 불러오는 중..."
                    : "모델을 불러왔습니다. 캠을 연결해주세요."}
                </div>
              </div>
            )}
            {showDot && (
              <span className="absolute -top-1 -right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              </span>
            )}
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className={`${
            showCam ? "block" : "hidden"
          } z-30 ring-4 ring-blue-300`}
        >
          <video ref={videoRef}></video>
        </canvas>
        <div className="fixed top-20 right-10 flex flex-col gap-3 w-96 transition-all">
          {toastList.map(
            (item, index) => item !== "" && <Toast message={item} key={index} />
          )}
        </div>
      </div>
    </>
  );
}

export default Detection;
