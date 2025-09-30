import { useNavigate } from "react-router-dom";


export function FakeLinkB() {
  const navigate = useNavigate()

  const base = import.meta.env.BASE_URL || "/";
  const getImagePath = (name: string) => `${base.replace(/\/$/, "")}/${name}`;


  return <>
    <div className="overflow-auto w-full h-screen">
      {/* 主图 */}
      <div className="w-full relative overflow-hidden">
        <img
          src={getImagePath("fake_link_b.png")}
          alt="人才服务说明"
          className="w-full"
        />
        <div className="absolute w-1/2 h-[53vw] top-[153vw] left-0" onClick={() => navigate("/fake-link-c")} />
        <div className="absolute w-2 h-1/2 bottom-0 right-0 bg-[#fffcf9]" />
        <div className="absolute w-screen h-[20vw] bottom-0 left-0 bg-white" />
      </div>

      <img
        src={getImagePath("fake_link_b_float.png")}
        className="fixed top-[31vh] right-0 w-[14vw]"
      />

      <img
        src={getImagePath("fake_link_b_float_b.png")}
        className="fixed top-[22vh] left-0 w-[13vw]"
      />

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0">
        <img
          src={getImagePath("fake_link_b_footer.png")}
          className="w-full"
        />
      </div>
    </div>
  </>

}