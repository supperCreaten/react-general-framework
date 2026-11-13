function NotFoundArt() {
  return (
    <svg className="block h-auto w-full" viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="210" cy="232" rx="128" ry="18" fill="#0F8F82" fillOpacity="0.1" />

      <rect x="78" y="54" width="264" height="168" rx="22" fill="#fff" fillOpacity="0.72" />
      <rect
        x="78"
        y="54"
        width="264"
        height="168"
        rx="22"
        stroke="#0F8F82"
        strokeOpacity="0.16"
        strokeWidth="2"
      />

      <path
        d="M118 168c28-46 62-58 96-34 28 20 54 8 86-24"
        stroke="#0F8F82"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeDasharray="7 8"
        strokeLinecap="round"
      />
      <circle cx="118" cy="168" r="7" fill="#0F8F82" />
      <circle cx="300" cy="110" r="7" fill="#F0B429" />

      <path
        d="M300 78c-12 0-22 9.4-22 21 0 16.5 22 35 22 35s22-18.5 22-35c0-11.6-10-21-22-21z"
        fill="#F0B429"
      />
      <circle cx="300" cy="99" r="7" fill="#fff" />

      <g transform="translate(156 126)">
        <path d="M0 28L46 8l46 20v52L46 100 0 80V28z" fill="#0B6F8A" />
        <path d="M46 8v92" stroke="#E7F6F4" strokeWidth="2" strokeOpacity="0.55" />
        <path d="M0 28l46 20 46-20" stroke="#E7F6F4" strokeWidth="2" strokeOpacity="0.55" />
        <path d="M18 42h28v10H18z" fill="#F0B429" />
      </g>
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="relative box-border m-[-0.5rem] flex h-[calc(100%+1rem)] min-h-[480px] w-[calc(100%+1rem)] items-center justify-center overflow-hidden bg-[#f3f6f8]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_28%,rgb(15_143_130/14%)_0%,transparent_70%),radial-gradient(ellipse_40%_35%_at_78%_72%,rgb(11_111_138/10%)_0%,transparent_65%),linear-gradient(180deg,#eef5f4_0%,#f5f7f9_48%,#eef2f5_100%)]"
        aria-hidden
      >
        <span className="absolute top-[12%] left-[10%] size-[180px] rounded-full bg-[rgb(15_143_130/18%)] opacity-55 blur-[8px]" />
        <span className="absolute right-[8%] bottom-[14%] size-[220px] rounded-full bg-[rgb(11_111_138/14%)] opacity-55 blur-[8px]" />
      </div>

      <div className="relative z-[1] flex w-[min(100%,560px)] flex-col items-center px-7 py-8 text-center animate-nf-rise max-[560px]:px-5 max-[560px]:py-7">
        <p className="m-0 mb-1 select-none indent-[0.08em] text-[clamp(96px,16vw,148px)] font-extrabold leading-[0.92] tracking-[0.08em] text-[#0f8f82] max-[560px]:text-[clamp(80px,22vw,112px)]">
          404
        </p>

        <div className="-mt-2 mb-1 w-[min(100%,320px)]">
          <NotFoundArt />
        </div>

        <h1 className="m-0 mb-2.5 text-[clamp(24px,3.2vw,30px)] font-bold leading-[1.25] tracking-[0.04em] text-[#1c2430]">
          页面不存在
        </h1>
        <p className="m-0 mb-7 max-w-[28em] text-[15px] leading-[1.75] text-[#6a7786]">
          当前地址没有对应页面，或你暂无访问权限。请从左侧菜单重新进入，或返回上一页继续操作。
        </p>

        <div className="grid w-full grid-cols-3 gap-px overflow-hidden rounded-xl border border-[rgb(15_143_130/12%)] bg-[rgb(15_143_130/12%)] max-[560px]:grid-cols-1">
          <div className="bg-[rgb(255_255_255/82%)] px-3 py-3.5 backdrop-blur-[6px]">
            <p className="m-0 mb-1 text-lg font-bold tracking-[0.04em] text-[#1c2430]">核对</p>
            <p className="m-0 text-xs leading-[1.4] text-[#6a7786]">检查链接是否完整有效</p>
          </div>
          <div className="bg-[rgb(255_255_255/82%)] px-3 py-3.5 backdrop-blur-[6px]">
            <p className="m-0 mb-1 text-lg font-bold tracking-[0.04em] text-[#1c2430]">菜单</p>
            <p className="m-0 text-xs leading-[1.4] text-[#6a7786]">从左侧导航重新进入</p>
          </div>
          <div className="bg-[rgb(255_255_255/82%)] px-3 py-3.5 backdrop-blur-[6px]">
            <p className="m-0 mb-1 text-lg font-bold tracking-[0.04em] text-[#1c2430]">权限</p>
            <p className="m-0 text-xs leading-[1.4] text-[#6a7786]">必要时联系管理员开通</p>
          </div>
        </div>

        <p className="mt-5 mb-0 text-xs leading-normal text-[#8a97a6]">
          TMS 运输管理平台 · 找不到页面时不影响其他模块正常使用
        </p>
      </div>
    </div>
  )
}
