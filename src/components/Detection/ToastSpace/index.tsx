import Toast from "../../Toast";

interface Props {
  toastList: string[];
}

function ToastSpace({ toastList }: Props) {
  return (
    <div className="fixed top-28 right-10 flex flex-col gap-3 w-96 transition-all">
      {toastList.map(
        (item, index) => item !== "" && <Toast message={item} key={index} />
      )}
    </div>
  );
}

export default ToastSpace;
