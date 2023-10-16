import { useState, useEffect, useRef } from "react";
import knifeMan from "../../assets/images/knife_man.png";

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

function DetectionPage() {
  const WIDTH = window.innerWidth > 640 ? 640 : window.innerWidth;
  const HEIGHT = WIDTH * 0.75;
  const [model, setModel] = useState<any>(null);
  const [showCam, setShowCam] = useState(false);
  const [boundingBoxColors, setBoundingBoxColors] = useState({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [danger, setDanger] = useState(false);

  const getModel = async () => {
    const model = await window.roboflow
      .auth({
        publishable_key: "rf_c77RUyvX4YVQErgMejdnDHPD61d2",
      })
      .load({
        model: "weapon-detection-tvvhx",
        version: 5,
      });

    setModel(model);
    setShowCam(true);
  };

  useEffect(() => {
    getModel();
  }, []);

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

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <img
          src={knifeMan}
          alt="logo"
          className={`${showCam ? "hidden" : "block"}`}
        />
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className={`${showCam ? "block" : "hidden"}`}
        >
          <video ref={videoRef}></video>
        </canvas>
      </div>
    </>
  );
}

export default DetectionPage;
