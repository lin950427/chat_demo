
import { useState, useRef, useEffect } from "react";

// 弹窗组件
function Modal({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}) {

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 弹窗内容 */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-6">办理须知</h2>
          <p className="text-sm text-gray-700 leading-8">
            每批人才驿站的集中受理时间为上一批截止时间之后至当月最后一个工作日15时。在此时间段申请的人员经资格评估和网上公示之后，将于下一个月中下旬，与上一批未获得入住资格的申请人一同进入本批人才驿站的排序公告、入住资格确定、签约入住等环节。
          </p>
          <p className="h-28" />
          {/* 底部按钮 */}
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-md bg-[#DCB98D] text-white font-medium text-center"
            style={{
              background: 'linear-gradient(90deg, #e1c794 0%, #bb9169 100%)'
            }}
          >
            我已知晓，立即办理
          </button>
        </div>

      </div>
    </div>
  );
}

export function FakeLink() {
  const [step, setStep] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const base = import.meta.env.BASE_URL || "/";
  const getImagePath = (name: string) => `${base.replace(/\/$/, "")}/${name}`;

  // 监听 step 变化，执行滚动
  useEffect(() => {
    if (step === 2 && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [step]);

  return step === 1 ? <>
    <div className="overflow-auto w-full h-screen">
      {/* 主图 */}
      <div className="w-full h-[573.846vw] relative overflow-hidden" ref={containerRef}>
        <img
          src={getImagePath("fake_link.png")}
          alt="人才服务说明"
          className="w-full -mt-[24.98vw]"
        />
        <div className="absolute w-screen h-[20vw] bottom-0 left-0 bg-[#fdf9ed]" />
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 py-4 px-6 bg-[#fdf9ed]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 text-white rounded-lg"
          style={{
            background: 'linear-gradient(90deg, #e1c794 0%, #bb9169 100%)'
          }}
        >
          办理事项
        </button>
      </div>
    </div>

    {/* 弹窗 */}
    <Modal
      isOpen={isModalOpen}
      onConfirm={() => {
        setStep(2)
        setIsModalOpen(false)
      }}
      onClose={() => setIsModalOpen(false)}
    />
  </> : <div className="overflow-auto w-full h-screen">
    <div className="w-full" ref={containerRef}>
      <img
        src={getImagePath("fake_link2.png")}
        alt="人才服务说明"
        className="w-full -mt-[24.98vw]"
      />
    </div>
  </div>

}