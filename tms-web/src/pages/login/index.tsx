import { useState } from "react";
import { cn } from "@/utils/methods";
import LoginForm from "./loginForm";
import ChangePasswordForm from "./changePasswordForm";
import loginLogisticsBg from "@/assets/images/login_logistics_bg.jpg";
import brandLogo from "@/assets/svg/logo.svg";

type LoginView = "login" | "changePassword";

const FEATURES = ["运单追踪", "智能调度", "车队管理", "司机协同", "轨迹回放", "运费结算"] as const;

export default function LoginPage() {
  const [view, setView] = useState<LoginView>("login");
  const [loginFormKey, setLoginFormKey] = useState(0);
  const [changePasswordFormKey, setChangePasswordFormKey] = useState(0);
  const isFlipped = view === "changePassword";

  const backToLogin = () => {
    setLoginFormKey((key) => key + 1);
    setView("login");
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden>
        <img
          className="login-page__photo"
          src={loginLogisticsBg}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <span className="login-page__veil" />
        <span className="login-page__grid" />
        <span className="login-page__vignette" />
      </div>

      <div className="login-shell">
        <aside className="login-brand">
          <div className="login-system">
            <div className="login-system__logo" aria-hidden>
              <img src={brandLogo} alt="" width={52} height={52} />
            </div>
            <div className="login-system__text">
              <h1 className="login-system__name">TMS运输管理平台</h1>
              <p className="login-system__en">Transportation Management System</p>
            </div>
          </div>

          <p className="login-brand__tagline">连接运力，掌控全程</p>
          <p className="login-brand__desc">
            面向公路货运的一体化物流操作系统，覆盖运单、调度、车队与结算全链路。
          </p>

          <ul className="login-brand__features">
            {FEATURES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>

        <div className="login-stage">
          <div className={cn("login-card-flip", isFlipped && "is-flipped")}>
            <div className="login-card-flip__inner">
              <section className="login-card login-card-flip__face login-card-flip__face--front">
                <div className="login-card__head">
                  <h2 className="login-card__title">欢迎登录</h2>
                  <p className="login-card__subtitle">使用账号密码进入运输管理平台</p>
                </div>
                <LoginForm
                  key={loginFormKey}
                  onForgotPassword={() => {
                    setChangePasswordFormKey((key) => key + 1);
                    setView("changePassword");
                  }}
                />
              </section>

              <section className="login-card login-card-flip__face login-card-flip__face--back">
                <div className="login-card__head">
                  <h2 className="login-card__title">修改密码</h2>
                  <p className="login-card__subtitle">设置新密码后可使用新凭证登录</p>
                </div>
                <ChangePasswordForm key={changePasswordFormKey} onBackToLogin={backToLogin} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
