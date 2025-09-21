
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  bannerHeight?: number;
  className?: string;
}

export function Layout({
  children,
  // title = "虹口区旗舰店",
  // bannerHeight = 0, // 默认 banner 高度为 44px
  className,
}: LayoutProps) {

  return (
    <div className={`min-h-screen ${className}`} >
      {/* 使用 sticky 定位的顶部 header */}
      {/* <header
        className="sticky top-0 z-10 flex items-center px-4 py-3 bg-primary text-primary-foreground"
        style={{
          marginTop: `${bannerHeight}px`,
        }}>
        <button className="flex items-center text-sm">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          {t("common.back")}
        </button>
        <h1 className="flex-1 text-center text-base font-normal">{title}</h1>
        <button className="flex items-center text-sm">
          <Cross2Icon className="w-5 h-5 mr-1" />
          {t("common.close")}
        </button>
      </header> */}
      {/* main 区域，内容可以自由滚动 */}

      <main className="relative">
        {children}
        {/* <div className="absolute w-full h-screen bg-red" /> */}
      </main>
    </div>
  );
}
