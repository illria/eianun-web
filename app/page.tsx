"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "全部" | "加密交易所" | "冷钱包" | "券商" | "银行卡" | "跨境通讯";

const categories: { label: Category; icon: string }[] = [
  { label: "全部", icon: "✦" },
  { label: "加密交易所", icon: "₿" },
  { label: "冷钱包", icon: "▣" },
  { label: "券商", icon: "↗" },
  { label: "银行卡", icon: "▤" },
  { label: "跨境通讯", icon: "⌁" },
];

const tools: {
  name: string;
  short: string;
  category: Exclude<Category, "全部">;
  label: string;
  detail: string;
  code?: string;
  tone: string;
}[] = [
  { name: "欧易 OKX", short: "OKX", category: "加密交易所", label: "全球合约第一", detail: "新人注册，现货与合约一站式使用", code: "SOL999", tone: "blue" },
  { name: "币安 Binance", short: "BNB", category: "加密交易所", label: "全球最大现货", detail: "适合长期持有与多币种交易", code: "TALA888", tone: "yellow" },
  { name: "Bybit", short: "BB", category: "加密交易所", label: "衍生品 + 现货", detail: "界面清晰，支持多种资产交易", code: "NIFULEI20", tone: "violet" },
  { name: "OneKey", short: "OK", category: "冷钱包", label: "进阶首选 · 开源", detail: "私钥离线保存，适合新手入门", code: "NIFULEI", tone: "orange" },
  { name: "SafePal", short: "SP", category: "冷钱包", label: "币安生态支持", detail: "硬件钱包与移动端配合使用", code: "766177", tone: "green" },
  { name: "Ledger", short: "LGR", category: "冷钱包", label: "专业级 · 行业标杆", detail: "多资产管理，适合进阶用户", tone: "slate" },
  { name: "盈立证券 uSMART", short: "U", category: "券商", label: "港美股 · 低佣金", detail: "港美股账户与资产配置入口", code: "U02662", tone: "cyan" },
  { name: "Interactive Brokers", short: "IB", category: "券商", label: "机构级平台", detail: "全球市场与专业交易工具", tone: "red" },
  { name: "Wise", short: "W", category: "银行卡", label: "多币种 · 低摩擦", detail: "跨境收款、换汇与国际转账", tone: "green" },
  { name: "N26", short: "N26", category: "银行卡", label: "欧洲数字银行", detail: "数字化银行账户体验", code: "yanmingk73062c", tone: "pink" },
  { name: "giffgaff", short: "gg", category: "跨境通讯", label: "英国 eSIM 号码", detail: "英国号码与境外流量方案", tone: "lime" },
  { name: "Eskimo", short: "ESK", category: "跨境通讯", label: "全球 eSIM 流量", detail: "短期出境的流量选择", code: "NIFULEI", tone: "purple" },
];

const journeys = [
  { icon: "₿", title: "买加密货币", text: "购买 BTC、ETH、USDT，了解交易所、钱包与安全存储" },
  { icon: "📈", title: "投资港股 · 美股", text: "开通账户，低费率买入全球资产，建立自己的配置路径" },
  { icon: "🏦", title: "建立海外银行账户", text: "持有外币、收国际工资，解决跨境收款与转账问题" },
  { icon: "📡", title: "解决出境上网", text: "eSIM、境外号码与流量方案，保持稳定的通讯环境" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [category, setCategory] = useState<Category>("全部");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("eianun-theme");
    if (savedTheme === "light") setIsDark(false); // eslint-disable-line react-hooks/set-state-in-effect
    const acknowledged = window.sessionStorage.getItem("eianun-disclaimer");
    if (acknowledged) setModalOpen(false);
  }, []);

  useEffect(() => {
    if (!modalOpen || countdown === 0) return;
    const timer = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [modalOpen, countdown]);

  const visibleTools = useMemo(
    () => (category === "全部" ? tools : tools.filter((tool) => tool.category === category)),
    [category],
  );

  function toggleTheme() {
    setIsDark((value) => {
      const next = !value;
      window.localStorage.setItem("eianun-theme", next ? "dark" : "light");
      return next;
    });
  }

  function enterSite() {
    window.sessionStorage.setItem("eianun-disclaimer", "1");
    setModalOpen(false);
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <main className={isDark ? "site-shell dark" : "site-shell light"}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand" onClick={() => scrollToId("top")} aria-label="回到首页">
          <span className="brand-mark">泥</span>
          <span>
            <strong>泥伏雷</strong>
            <small>闯关记 · 出海金融第一站</small>
          </span>
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="主导航">
          <button onClick={() => { scrollToId("journey"); setMenuOpen(false); }}>金融路线图</button>
          <button onClick={() => { scrollToId("toolbox"); setMenuOpen(false); }}>工具库</button>
          <button onClick={() => { scrollToId("about"); setMenuOpen(false); }}>关于本站</button>
          <a href="https://x.com/" target="_blank" rel="noreferrer">𝕏 关注</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}>
            {isDark ? "☼" : "☾"}
          </button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="打开菜单">☰</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="pulse-dot" /> 出海金融操作系统</div>
        <h1>普通人的<br /><em>海外资金</em>通关路径图</h1>
        <p className="hero-copy">不是博客，是工具。告诉我你想做什么，<br className="desktop-break" />我给你完整路径、推荐工具和可执行的下一步。</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => scrollToId("journey")}>🚀 开始闯关 <span>→</span></button>
          <button className="text-button" onClick={() => scrollToId("toolbox")}>浏览工具库 <span>↓</span></button>
        </div>
        <div className="hero-stats">
          <span><strong>20+</strong> 收录工具</span>
          <span><strong>5</strong> 内容分类</span>
          <span><strong>7</strong> 闯关步骤</span>
        </div>
      </section>

      <section className="section-block" id="journey">
        <div className="section-heading">
          <div><span className="section-kicker">STEP 01 · CHOOSE YOUR SCENARIO</span><h2>你想解决什么问题？</h2></div>
          <p>选对路径，少走弯路<br />每一条路都从真实需求出发</p>
        </div>
        <div className="journey-grid">
          {journeys.map((item, index) => (
            <button className="journey-card" key={item.title} onClick={() => { setCategory(index === 0 ? "加密交易所" : index === 1 ? "券商" : index === 2 ? "银行卡" : "跨境通讯"); scrollToId("toolbox"); }}>
              <span className="card-number">0{index + 1}</span><span className="journey-icon">{item.icon}</span>
              <h3>{item.title}</h3><p>{item.text}</p><span className="arrow-link">查看完整路径 →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="feature-strip">
        <div className="feature-copy"><span className="section-kicker">FEATURED · 独立工具页</span><h2>把复杂的跨境生活<br /><em>拆成可以执行的步骤</em></h2><p>从网络环境到银行卡，从交易所到冷钱包，把每个关键节点放在一张地图上。</p><button className="outline-button" onClick={() => scrollToId("steps")}>查看 7 步路线图 <span>↗</span></button></div>
        <div className="map-visual" aria-label="资金路线图示意图">
          <div className="map-line line-a" /><div className="map-line line-b" /><div className="map-line line-c" />
          <span className="map-node node-a">⌁<small>网络</small></span><span className="map-node node-b">₿<small>交易所</small></span><span className="map-node node-c">▤<small>银行卡</small></span><span className="map-node node-d">▣<small>冷钱包</small></span>
        </div>
      </section>

      <section className="section-block toolbox" id="toolbox">
        <div className="section-heading tools-heading"><div><span className="section-kicker">STEP 02 · TAKE ACTION</span><h2>新人必备工具</h2></div><span className="tool-count">{visibleTools.length} 个工具</span></div>
        <div className="category-tabs" role="tablist" aria-label="工具分类">
          {categories.map((item) => <button key={item.label} className={category === item.label ? "active" : ""} onClick={() => setCategory(item.label)} role="tab" aria-selected={category === item.label}><span>{item.icon}</span>{item.label}</button>)}
        </div>
        <div className="tool-grid">
          {visibleTools.map((tool) => <article className="tool-card" key={tool.name}><div className="tool-top"><span className={`tool-logo ${tool.tone}`}>{tool.short}</span><span className="tool-category">{tool.category}</span></div><h3>{tool.name}</h3><strong>{tool.label}</strong><p>{tool.detail}</p>{tool.code ? <div className="code-row"><span>邀请码 <b>{tool.code}</b></span><button onClick={() => copyCode(tool.code!)}>{copied === tool.code ? "已复制" : "复制"}</button></div> : <div className="code-row muted"><span>专属链接，无邀请码</span><span>↗</span></div>}<a href="#disclaimer" onClick={(event) => event.preventDefault()} className="tool-link">了解更多 <span>→</span></a></article>)}
        </div>
      </section>

      <section className="trust-block" id="about"><div className="trust-icon">✦</div><div><span className="section-kicker">STEP 03 · WHY TRUST THIS</span><h2>真实经历，不是搬运</h2><p>这里记录的是跨境生活中真实遇到的问题、踩过的坑，以及整理之后可以复用的方法。内容仅供参考，请在使用前自行核验服务条款与所在地规则。</p></div><div className="trust-numbers"><span><strong>20+</strong> 工具</span><span><strong>100%</strong> 亲测记录</span></div></section>

      <section className="steps-block" id="steps"><div className="section-heading"><div><span className="section-kicker">EXPLORE · 7-STAGE JOURNEY</span><h2>从网络到全球通</h2></div><p>一张图看懂资金流转<br />每一步都有工具推荐</p></div><div className="steps-list">{["网络环境", "交易所", "银行账户", "券商账户", "冷钱包", "资金流转"].map((step, index) => <button key={step} onClick={() => scrollToId("toolbox")}><span>0{index + 1}</span><b>{step}</b><i>→</i></button>)}</div></section>

      <footer className="footer"><div className="footer-brand"><span className="brand-mark">泥</span><span><strong>泥伏雷闯关记</strong><small>出海金融 · 实战干货</small></span></div><div className="footer-links"><a href="#journey">金融路线图</a><a href="#toolbox">工具库</a><a href="#about">关于本站</a><a href="#disclaimer">免责声明</a></div><p>© 2026 EIANUN · 内容仅供参考，不构成投资建议</p></footer>

      {modalOpen && <div className="modal-backdrop"><section className="disclaimer-modal" id="disclaimer" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title"><div className="modal-symbol">!</div><span className="section-kicker">DISCLAIMER · 泥伏雷闯关记</span><h2 id="disclaimer-title">先说清楚，再一起出发</h2><p>本平台内容仅供参考，基于公开信息及个人经验整理，不构成投资、金融、法律或税务建议。相关服务可能受市场、政策和地区规则影响，请你自行判断并承担使用风险。</p><p>本站可能包含推广链接或邀请码，作者可能因此获得佣金。继续访问即代表你已阅读并理解以上说明，并会遵守所在地区的法律法规。</p><button className="primary-button full" onClick={enterSite} disabled={countdown > 0}>我已了解，进入网站 {countdown > 0 ? `(${countdown}s)` : "→"}</button></section></div>}
    </main>
  );
}
