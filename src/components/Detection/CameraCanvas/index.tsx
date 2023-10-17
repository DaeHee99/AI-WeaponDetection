interface Props {
  canvasRef: React.ForwardedRef<HTMLCanvasElement>;
  videoRef: React.ForwardedRef<HTMLVideoElement>;
  WIDTH: number;
  HEIGHT: number;
  showCam: boolean;
}

function CameraCanvas({ canvasRef, videoRef, WIDTH, HEIGHT, showCam }: Props) {
  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className={`${showCam ? "block" : "hidden"} z-30 ring-4 ring-blue-300`}
    >
      <video ref={videoRef}></video>
    </canvas>
  );
}

export default CameraCanvas;
