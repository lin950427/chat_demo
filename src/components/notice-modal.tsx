import { useState } from "react";
import { Link } from "react-router-dom";

interface NoticeModalProps {
    visible: boolean;
    onAgree: () => void;
    onDisagree: () => void;
}

export default function NoticeModal({ visible, onAgree, onDisagree }: NoticeModalProps) {
    const [checked, setChecked] = useState(false);

    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-[calc(100%-72px)] p-5 pt-6 shadow-xl">
                <h4 className="text-base font-bold text-[#333] mb-2">使用须知</h4>
                <div className="text-[#333] text-sm leading-[22px] mb-4">
                    <p className="mb-2">感谢您使用“AI小虹”，我们仅在为您提供服务所需的范围内收集和使用相关信息，并将全力保障您的个人隐私与数据安全。</p>
                    <p className="mb-2">答复内容来源于虹口区人才政策智能解析。如有疑问，可通过人工服务进一步确认。</p>
                    <p className="mb-2">为保障您的权益，请认真阅读
                        <Link to="/service-agreement" className="text-[#7f5b14] underline mx-1" target="_blank">《服务使用协议》</Link>
                        和
                        <Link to="/disclaimer" className="text-[#7f5b14] underline mx-1" target="_blank">《责任告知声明》</Link>
                        。
                    </p>
                </div>
                <label className="flex items-center mb-5 select-none cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => setChecked(e.target.checked)}
                        className="accent-[#b08a3a] w-4 h-4 mr-2"
                    />
                    <span className="text-xs text-[#393939]">我已仔细阅读并同意</span>
                </label>
                <div className="flex justify-center px-5">
                    <button
                        className="flex-1 py-2.5 rounded-[6px] bg-[#f9f9fb] text-[#333] font-bold text-sm"
                        onClick={onDisagree}
                    >不同意</button>
                    <span className="w-2.5 inline-block" />
                    <button
                        className="flex-1 py-2.5 rounded-[6px] bg-[#b08a3a] text-white font-bold text-sm disabled:opacity-50"
                        onClick={onAgree}
                        disabled={!checked}
                    >同意</button>
                </div>
            </div>
        </div>
    );
}
