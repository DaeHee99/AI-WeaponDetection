import { useState, useEffect, useRef } from "react";
import beep from "../../assets/audios/beep.mp3";
import ToastSpace from "./ToastSpace";
import CameraCanvas from "./CameraCanvas";
import Intro from "./Intro";
import DetectionWrapper from "./DetectionWrapper";

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

interface predictionsType {
  bbox: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
  class: string;
  color: string;
  confidence: number;
}

interface Props {
  showCam: boolean;
  setShowCam: React.Dispatch<React.SetStateAction<boolean>>;
}

function Detection({ showCam, setShowCam }: Props) {
  const WIDTH = window.innerWidth > 640 ? 640 : window.innerWidth;
  const HEIGHT = WIDTH * 0.75;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audio] = useState(new Audio(beep));
  const [model, setModel] = useState<any>(null);
  const [boundingBoxColors, setBoundingBoxColors] = useState({});
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

  const clickHandler = () => {
    if (step !== 0) return;

    setStep(1);
    setShowDot(false);
    getModel();
    audio.loop = true;
  };

  const getCoordinates = (img: HTMLVideoElement) => {
    const dWidth = window.innerWidth;
    const dHeight = window.innerHeight;
    const sWidth = 0;
    const sHeight = 0;
    const imageWidth = img.width;
    const imageHeight = img.height;

    const canvasRatio = dWidth / dHeight;
    const imageRatio = imageWidth / imageHeight;

    let sy: number;
    let sx: number;

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
  };

  const drawBoundingBoxes = (
    predictions: predictionsType[],
    ctx: CanvasRenderingContext2D,
    scalingRatio: number,
    sx: number,
    sy: number
  ) => {
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
      ctx.lineWidth = 4;
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
  };

  const startDetection = () => {
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
              model.detect(video).then((predictions: predictionsType[]) => {
                for (let i = 0; i < predictions.length; i++) {
                  if (predictions[i].class === "knife") {
                    setCatchItem("칼");
                    setDanger(true);
                    break;
                  }
                  if (predictions[i].class === "hammer") {
                    setCatchItem("망치");
                    setDanger(true);
                    break;
                  }
                  if (predictions[i].class === "gun") {
                    setCatchItem("총");
                    setDanger(true);
                    break;
                  }
                  if (predictions[i].class === "axe") {
                    setCatchItem("도끼");
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

                ctx &&
                  drawBoundingBoxes(predictions, ctx, scalingRatio, sx, sy);
              });
            }, 1000 / 30);
          },
          false
        );
      });
  };

  useEffect(() => {
    danger ? audio.play() : audio.pause();
  }, [danger]);

  useEffect(() => {
    if (!model) return;
    startDetection();
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

  return (
    <DetectionWrapper danger={danger}>
      <Intro
        showCam={showCam}
        clickHandler={clickHandler}
        step={step}
        showDot={showDot}
      />
      <CameraCanvas
        canvasRef={canvasRef}
        videoRef={videoRef}
        WIDTH={WIDTH}
        HEIGHT={HEIGHT}
        showCam={showCam}
      />
      <ToastSpace toastList={toastList} />
    </DetectionWrapper>
  );
}

export default Detection;
