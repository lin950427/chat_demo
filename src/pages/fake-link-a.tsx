import { useInViewport } from "ahooks";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";


export function FakeLinkA() {
  const navigate = useNavigate()

  const ref = useRef(null);
  const [inViewport] = useInViewport(ref);


  const base = import.meta.env.BASE_URL || "/";
  const getImagePath = (name: string) => `${base.replace(/\/$/, "")}/${name}`;


  return <>
    <div className="overflow-auto w-full h-screen">
      <img
        src={getImagePath("fake_link_a_header_a.png")}
        className="top-0 fixed w-screen bg-white z-10"
      />
      <div className={`top-[14vw] fixed w-screen bg-white z-10 pb-[1vw] shadow ${!inViewport ? 'block' : 'hidden'}`}>
        <img
          src={getImagePath("fake_link_a_header_b.png")}
          className="w-full"
        />
      </div>

      {/* 主图 */}
      <div className="w-full relative overflow-hidden">
        <img
          src={getImagePath("fake_link_a.png")}
          className="w-full -mt-[15vw]"
        />
        <div className="top-[37vw] absolute w-screen" ref={ref} />
        <div className="absolute w-screen h-[24vw] bottom-0 left-0 bg-white" />
        <div className="absolute w-screen h-[14vw] top-0 left-0 bg-white" />
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0">
        <img
          src={getImagePath("fake_link_a_footer.png")}
          className="w-full"
        />
        <div className="absolute h-[88%] w-[20vw] left-0 bottom-0" onClick={() => navigate("/fake-link-b")} />
      </div>
    </div>
  </>

}