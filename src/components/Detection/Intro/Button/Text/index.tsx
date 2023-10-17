import Loading from "./Loading";

interface Props {
  step: number;
}

function Text({ step }: Props) {
  if (step === 0) return <span>시작하기</span>;
  else
    return (
      <div className="flex items-center justify-center">
        <Loading />
        <div>
          {step === 1
            ? "모델을 불러오는 중..."
            : "모델을 불러왔습니다. 캠을 연결해주세요."}
        </div>
      </div>
    );
}

export default Text;
