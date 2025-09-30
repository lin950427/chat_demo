import { useNavigate } from "react-router-dom";


export function FakeLinkD() {
  const navigate = useNavigate()

  const base = import.meta.env.BASE_URL || "/";
  const getImagePath = (name: string) => `${base.replace(/\/$/, "")}/${name}`;


  return <>
    <div className="overflow-auto w-full h-screen">
      {/* 主图 */}
      <div className="w-full relative overflow-hidden">
        <img
          src={getImagePath("fake_link_d.png")}
          className="w-full"
        />
        <div className="absolute w-1/2 h-[22vw] top-[122vw] left-0" onClick={() => navigate("/fake-link")} />
      </div>
    </div>
  </>

}