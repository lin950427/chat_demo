import { useNavigate } from "react-router-dom";


export function FakeLinkC() {

  const navigate = useNavigate()

  const base = import.meta.env.BASE_URL || "/";
  const getImagePath = (name: string) => `${base.replace(/\/$/, "")}/${name}`;


  return <>
    <div className="overflow-auto w-full h-screen">
      {/* 主图 */}
      <div className="w-full relative overflow-hidden">
        <img
          src={getImagePath("fake_link_c.png")}
          className="w-full"
        />
        <div className="absolute w-full h-[61vw] top-0 left-0" onClick={() => navigate("/home")} />
        <div className="absolute w-1/2 h-[23vw] top-[101vw] left-0" onClick={() => navigate("/fake-link-d")} />
        <div className="absolute w-2 h-full bottom-0 right-0 bg-[#fffcf9]" />
      </div>
    </div>
  </>

}