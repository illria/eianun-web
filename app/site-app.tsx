"use client";

import { useEffect, useMemo, useState } from "react";
import siteData from "../public/site-data.json";

type Tool = {
  id: string;
  name: string;
  mark: string;
  category: string;
  group: string;
  kind?: string;
  label: string;
  detail: string;
  code?: string;
  altCode?: string;
  link: string;
  rating: string;
  badge?: string;
  wallets?: string[];
};

type Group = [string, string, string];
type CategoryPageData = {
  eyebrow: string;
  title: string;
  description: string;
  groups: Group[];
};

type SiteData = {
  navigation: { label: string; href: string; items: [string, string][] }[];
  offers: string[];
  tools: Tool[];
  categoryPages: Record<string, CategoryPageData>;
  brokerRanking: string[][];
  roadmap: { id: string; mark: string; title: string; summary: string; detail: string; href: string }[];
  journey: { title: string; mark: string; description: string; tasks: string[]; tools: string[] }[];
  faqs: [string, string][];
};

const data = siteData as SiteData;
const categoryLabels: Record<string, string> = {
  crypto: "加密 Web3",
  broker: "港美股券商",
  bank: "国外银行卡",
  esim: "跨境通讯",
};
const routeCategory: Record<string, string> = {
  "nifulei-crypto": "crypto",
  "nifulei-broker": "broker",
  "nifulei-bank": "bank",
  "nifulei-esim": "esim",
};

function routeFromPath(pathname: string) {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  return segment || "home";
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a className={className} href={href} target={isExternal(href) ? "_blank" : undefined} rel={isExternal(href) ? "noreferrer" : undefined}>
      {children}
    </a>
  );
}

function Header({
  dark,
  setDark,
  mobileOpen,
  setMobileOpen,
}: {
  dark: boolean;
  setDark: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="/">
          <span className="brand-mark">E</span>
          <span><b>EIANUN</b><small>出海金融行动指南</small></span>
        </a>
        <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label="主导航">
          {data.navigation.map((item) => (
            <div className="nav-group" key={item.label}>
              <a href={item.href}>{item.label}<span>⌄</span></a>
              <div className="nav-menu">
                {item.items.map(([label, href]) => <a href={href} key={href}>{label}<span>↗</span></a>)}
              </div>
            </div>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-follow" href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">GitHub ↗</a>
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "切换浅色模式" : "切换深色模式"}>{dark ? "☼" : "◐"}</button>
          <button className="mobile-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="打开菜单">{mobileOpen ? "×" : "☰"}</button>
        </div>
      </header>
      <div className="offer-strip" aria-label="常用优惠码">
        <div>{[...data.offers, ...data.offers].map((offer, index) => <span key={`${offer}-${index}`}>▸ {offer}</span>)}</div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="site-brand inverted" href="/">
          <span className="brand-mark">E</span>
          <span><b>EIANUN</b><small>出海金融行动指南</small></span>
        </a>
        <div className="footer-columns">
          <div><b>工具分类</b><a href="/nifulei-bank">国外银行卡</a><a href="/nifulei-broker">港美股券商</a><a href="/nifulei-crypto">加密 Web3</a><a href="/nifulei-esim">跨境通讯</a></div>
          <div><b>路线系统</b><a href="/nifulei-roadmap">金融路线图</a><a href="/nifulei-journey">8 关出海路线</a><a href="/nifulei-about">关于项目</a><a href="/nifulei-partner">副业合伙人</a></div>
          <div><b>项目</b><a href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">GitHub</a><a href="/nifulei-about#contact">联系方式</a><a href="/nifulei-about#donate">支持项目</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 EIANUN</span><span>内容仅供参考，不构成投资、金融、法律或税务建议</span></div>
    </footer>
  );
}

function ToolCard({
  tool,
  copied,
  onCopy,
  expanded,
  onExpand,
  region,
  onRegion,
}: {
  tool: Tool;
  copied: string | null;
  onCopy: (value: string) => void;
  expanded?: boolean;
  onExpand?: () => void;
  region?: "hk" | "sg";
  onRegion?: (value: "hk" | "sg") => void;
}) {
  const activeCode = tool.altCode && region === "sg" ? tool.altCode : tool.code;
  return (
    <article className="resource-card">
      <div className="resource-top">
        <span className="tool-mark">{tool.mark}</span>
        <div className="resource-badges">{tool.badge && <span>{tool.badge}</span>}<span>★ {tool.rating}</span></div>
      </div>
      <span className="resource-category">{categoryLabels[tool.category]} · {tool.label}</span>
      <h3>{tool.name}</h3>
      <p>{tool.detail}</p>
      {tool.altCode && onRegion && (
        <div className="region-switch">
          <button className={region !== "sg" ? "active" : ""} onClick={() => onRegion("hk")}>香港版</button>
          <button className={region === "sg" ? "active" : ""} onClick={() => onRegion("sg")}>新加坡版</button>
        </div>
      )}
      {activeCode ? (
        <div className="code-box"><span>{tool.altCode ? (region === "sg" ? "新加坡邀请码" : "香港邀请码") : "邀请码 / 折扣码"} <b>{activeCode}</b></span><button onClick={() => onCopy(activeCode)}>{copied === activeCode ? "已复制" : "复制"}</button></div>
      ) : (
        <div className="code-box"><span>官方入口</span><span>无需邀请码</span></div>
      )}
      {tool.wallets && onExpand && (
        <>
          <button className="wallet-toggle" onClick={onExpand}>支持的钱包 <span>{expanded ? "−" : "+"}</span></button>
          {expanded && <div className="wallet-panel">{tool.wallets.map((wallet) => <span key={wallet}>{wallet}</span>)}</div>}
        </>
      )}
      <SmartLink className="resource-link" href={tool.link}>{tool.category === "broker" ? "立即开户" : tool.category === "esim" ? "立即获取" : "查看官方入口"} <span>↗</span></SmartLink>
    </article>
  );
}

function HomePage({ copied, onCopy }: { copied: string | null; onCopy: (value: string) => void }) {
  const [quickCategory, setQuickCategory] = useState("crypto");
  const quickTools = data.tools.filter((tool) => tool.category === quickCategory).slice(0, 4);
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">EIANUN · 出海金融操作系统</span>
          <h1>普通人的<br /><em>全球资金通关图</em></h1>
          <p>不是一张工具清单，而是从网络、账户、投资到资产保管的完整行动路径。先选择你要解决的问题，再拿走对应步骤和入口。</p>
          <div className="hero-actions">
            <a className="button primary" href="/nifulei-journey">开始闯关 · 8 步路线 <span>→</span></a>
            <a className="button secondary" href="#needs">选择场景 <span>↓</span></a>
          </div>
          <div className="hero-stats"><span><b>40+</b>工具入口</span><span><b>08</b>核心页面</span><span><b>08</b>闯关步骤</span></div>
        </div>
        <div className="hero-map" aria-label="出海行动路线预览">
          <div className="map-head"><span>route://eianun</span><span>READY</span></div>
          {data.roadmap.slice(0, 5).map((item, index) => (
            <a href={item.href} className="mini-route" key={item.id}><span>{item.mark}</span><div><b>{item.title}</b><small>{item.summary}</small></div><i>{index === 4 ? "✓" : "↓"}</i></a>
          ))}
        </div>
      </section>

      <section className="section" id="needs">
        <SectionHead eyebrow="STEP 01 · 选择场景" title="你想解决什么问题？" note="从场景出发，避免被品牌列表带着走。" />
        <div className="need-grid">
          {[
            ["₿", "买加密货币 · 保护资产", "建立交易入口、钱包和长期资产保管路径。", "/nifulei-crypto"],
            ["📈", "投资港股 · 美股", "完成券商开户、入金和全球市场配置。", "/nifulei-broker"],
            ["🏦", "建立海外银行账户", "持有外币、跨境收付款和连接投资账户。", "/nifulei-bank"],
            ["📡", "解决出境上网", "准备境外号码、旅行流量和写卡方案。", "/nifulei-esim"],
          ].map(([mark, title, text, href], index) => (
            <a className="need-card" href={href} key={href}><span className="need-index">0{index + 1}</span><b className="need-mark">{mark}</b><h3>{title}</h3><p>{text}</p><strong>查看完整路径 <span>→</span></strong></a>
          ))}
        </div>
      </section>

      <section className="section featured-block">
        <SectionHead eyebrow="FEATURED · 精选专题" title="独立专题与实用路线" note="把一个问题讲完整，再回到工具入口。" />
        <div className="feature-grid">
          <a href="/nifulei-crypto#cold"><span>SECURITY</span><b>🔒</b><h3>硬件冷钱包选购与备份</h3><p>比较 OneKey、Ledger、SafePal 与 Tangem，先建立私钥保管逻辑。</p><strong>进入专题 ↗</strong></a>
          <a href="/nifulei-broker#chain"><span>NEW MARKET</span><b>📈</b><h3>链上美股与全球资产</h3><p>理解代币化股票、钱包连接和资产发行边界。</p><strong>进入专题 ↗</strong></a>
          <a href="/nifulei-journey"><span>START HERE</span><b>🚀</b><h3>8 关出海行动路线</h3><p>网络、号码、账户、券商、交易所、支付卡与冷钱包逐步完成。</p><strong>开始闯关 ↗</strong></a>
        </div>
      </section>

      <section className="section quick-tools">
        <SectionHead eyebrow="STEP 02 · 立即行动" title="新人常用工具" note="分类切换、复制邀请码并进入官方页面。" />
        <div className="category-tabs" role="tablist">
          {Object.entries(categoryLabels).map(([key, label]) => <button className={quickCategory === key ? "active" : ""} onClick={() => setQuickCategory(key)} key={key}>{label}</button>)}
        </div>
        <div className="resource-grid compact">{quickTools.map((tool) => <ToolCard tool={tool} copied={copied} onCopy={onCopy} key={tool.id} />)}</div>
        <a className="text-link" href={`/nifulei-${quickCategory === "esim" ? "esim" : quickCategory}`}>查看该分类完整工具库 →</a>
      </section>

      <section className="trust-section">
        <div><span className="eyebrow">STEP 03 · 使用原则</span><h2>真实经历，<br />不是搬运。</h2><p>页面围绕真实操作中会遇到的资格、费用、入金、转账和安全问题组织。入口会变化，使用前请再次核验地区和最新条款。</p></div>
        <div className="trust-stats"><span><b>40+</b>工具入口</span><span><b>04</b>核心分类</span><span><b>08</b>闯关步骤</span><span><b>100%</b>本地进度</span></div>
      </section>

      <section className="section">
        <SectionHead eyebrow="EXPLORE · 全部栏目" title="完整功能入口" note="分类页、路线图与项目说明均可独立访问。" />
        <div className="explore-grid">
          {[
            ["🏦", "国外银行卡", "国际账户 · 香港银行 · 美国企业账户", "/nifulei-bank"],
            ["📈", "港美股券商", "券商列表 · 综合排名 · 链上美股", "/nifulei-broker"],
            ["₿", "加密 Web3", "交易所 · DEX · 支付卡 · 冷热钱包", "/nifulei-crypto"],
            ["📡", "跨境通讯", "境外号码 · 流量平台 · eSIM 写卡器", "/nifulei-esim"],
            ["🗺", "金融路线图", "点击节点查看资金路径与下一步", "/nifulei-roadmap"],
            ["🚀", "出海路线图", "8 关进度 · 清单 · 本地保存", "/nifulei-journey"],
          ].map(([mark, title, text, href]) => <a href={href} key={href}><b>{mark}</b><div><h3>{title}</h3><p>{text}</p></div><span>↗</span></a>)}
        </div>
      </section>
      <JourneyTeaser />
      <Newsletter />
    </>
  );
}

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><p>{note}</p></div>;
}

function JourneyTeaser() {
  return (
    <section className="journey-teaser">
      <div><span className="eyebrow">8-STAGE JOURNEY</span><h2>从零到全球通</h2><p>网络 → 应用环境 → 境外号码 → 银行账户 → 港美股 → 交易所 → 支付卡 → 冷钱包</p><a className="button primary" href="/nifulei-journey">开始闯关 →</a></div>
      <div className="teaser-stages">{data.journey.map((stage, index) => <span key={stage.title}><i>{index + 1}</i>{stage.title}</span>)}</div>
    </section>
  );
}

function Newsletter() {
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    if (!email) return;
    window.localStorage.setItem("eianun-newsletter-email", email);
    setStatus("saved");
    event.currentTarget.reset();
  };

  return (
    <section className="newsletter-section">
      <div>
        <span className="eyebrow">FIELD NOTES · 邮箱订阅</span>
        <h2>想知道下一次更新？</h2>
        <p>留下邮箱，只接收路线、工具和功能更新。当前版本先在本设备保存订阅偏好，接入邮件服务后可直接迁移。</p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="newsletter-email">邮箱地址</label>
        <div>
          <input id="newsletter-email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
          <button type="submit">{status === "saved" ? "已保存 ✓" : "订阅更新 →"}</button>
        </div>
        <small>{status === "saved" ? "订阅偏好已保存在当前浏览器。" : "不发送营销轰炸；正式投递接口尚未接入。"}</small>
      </form>
    </section>
  );
}

function CategoryPage({
  route,
  copied,
  onCopy,
}: {
  route: string;
  copied: string | null;
  onCopy: (value: string) => void;
}) {
  const page = data.categoryPages[route];
  const category = routeCategory[route];
  const [brokerView, setBrokerView] = useState<"list" | "rank">("list");
  const [dexFilter, setDexFilter] = useState("all");
  const [expandedDex, setExpandedDex] = useState<string | null>(null);
  const [regions, setRegions] = useState<Record<string, "hk" | "sg">>({});

  return (
    <>
      <section className="page-hero">
        <span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p>
        <div className="anchor-nav">{page.groups.map(([id, title]) => <a href={`#${id}`} key={id}>{title}<span>↓</span></a>)}</div>
      </section>
      <main className="section page-content">
        {page.groups.map(([group, title, description]) => {
          let groupTools = data.tools.filter((tool) => tool.category === category && tool.group === group);
          if (group === "dex" && dexFilter !== "all") groupTools = groupTools.filter((tool) => tool.kind === dexFilter);
          return (
            <section className="resource-section" id={group} key={group}>
              <div className="resource-section-head"><div><span>{String(page.groups.findIndex((item) => item[0] === group) + 1).padStart(2, "0")}</span><h2>{title}</h2></div><p>{description}</p></div>
              {route === "nifulei-broker" && group === "hk" && (
                <div className="view-tabs"><button className={brokerView === "list" ? "active" : ""} onClick={() => setBrokerView("list")}>券商列表</button><button className={brokerView === "rank" ? "active" : ""} onClick={() => setBrokerView("rank")}>综合排名</button></div>
              )}
              {route === "nifulei-crypto" && group === "dex" && (
                <div className="view-tabs"><button className={dexFilter === "all" ? "active" : ""} onClick={() => setDexFilter("all")}>全部</button><button className={dexFilter === "spot" ? "active" : ""} onClick={() => setDexFilter("spot")}>现货 / AMM</button><button className={dexFilter === "perp" ? "active" : ""} onClick={() => setDexFilter("perp")}>永续合约</button></div>
              )}
              {route === "nifulei-broker" && group === "hk" && brokerView === "rank" ? (
                <div className="ranking-table">
                  <div className="rank-row rank-head"><span>排名</span><span>平台</span><span>类型</span><span>评分</span><span>特点</span></div>
                  {data.brokerRanking.map((row) => <div className="rank-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}
                </div>
              ) : (
                <div className="resource-grid">
                  {groupTools.map((tool) => <ToolCard
                    tool={tool}
                    copied={copied}
                    onCopy={onCopy}
                    key={tool.id}
                    expanded={expandedDex === tool.id}
                    onExpand={tool.wallets ? () => setExpandedDex(expandedDex === tool.id ? null : tool.id) : undefined}
                    region={regions[tool.id] || "hk"}
                    onRegion={tool.altCode ? (value) => setRegions((current) => ({ ...current, [tool.id]: value })) : undefined}
                  />)}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </>
  );
}

function RoadmapPage() {
  const [selected, setSelected] = useState<(typeof data.roadmap)[number] | null>(null);
  return (
    <>
      <section className="page-hero"><span className="eyebrow">FINANCE MAP</span><h1>金融路线图</h1><p>点击任意节点，查看这一步的作用、风险和下一步入口。</p></section>
      <main className="section roadmap-page">
        <SectionHead eyebrow="PATH 01 · 从基础设施开始" title="无海外账户用户路线" note="网络与号码 → 交易所 → 海外账户 → 券商 → 冷钱包 → 资金流转" />
        <div className="roadmap-flow">
          {data.roadmap.map((item, index) => <button onClick={() => setSelected(item)} key={item.id}><span>{item.mark}</span><div><h3>{item.title}</h3><p>{item.summary}</p></div><i>{index === data.roadmap.length - 1 ? "✓" : "→"}</i></button>)}
        </div>
        <div className="route-notes"><article><b>入金路线</b><p>本地资金 → 合规换汇 → 海外账户 → 券商或交易所</p></article><article><b>退出路线</b><p>平台资产 → 银行账户 → 合规换汇 → 本地账户</p></article><article><b>备用路线</b><p>始终保留第二账户、第二网络和小额测试路径</p></article></div>
      </main>
      {selected && <div className="dialog-backdrop" onClick={() => setSelected(null)}><section className="route-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="dialog-close" onClick={() => setSelected(null)}>×</button><span className="tool-mark">{selected.mark}</span><h2>{selected.title}</h2><p>{selected.detail}</p><a className="button primary" href={selected.href}>进入对应工具页 →</a></section></div>}
    </>
  );
}

function JourneyPage() {
  const [stage, setStage] = useState(0);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [guideOpen, setGuideOpen] = useState(true);
  useEffect(() => {
    try {
      setChecks(JSON.parse(window.localStorage.getItem("eianun-journey") || "{}")); // eslint-disable-line react-hooks/set-state-in-effect
      if (window.sessionStorage.getItem("eianun-journey-guide")) setGuideOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {}
  }, []);
  const active = data.journey[stage];
  const totalTasks = data.journey.reduce((sum, item) => sum + item.tasks.length, 0);
  const completed = Object.values(checks).filter(Boolean).length;
  const percentage = Math.round((completed / totalTasks) * 100);
  const toggle = (index: number) => {
    const key = `${stage}-${index}`;
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next);
    window.localStorage.setItem("eianun-journey", JSON.stringify(next));
  };
  const closeGuide = () => {
    window.sessionStorage.setItem("eianun-journey-guide", "1");
    setGuideOpen(false);
  };
  return (
    <>
      <section className="journey-header"><span className="eyebrow">8-STAGE JOURNEY</span><h1>出海路线图</h1><p>每一关都有目标、检查清单和工具入口，进度仅保存在当前设备。</p><div className="overall-progress"><span><b>{completed}</b> / {totalTasks} 项完成</span><span>{percentage}%</span><i><b style={{ width: `${percentage}%` }} /></i></div></section>
      <main className="journey-layout">
        <aside className="stage-sidebar">{data.journey.map((item, index) => <button className={stage === index ? "active" : ""} onClick={() => setStage(index)} key={item.title}><span>{index + 1}</span><i>{item.mark}</i><b>{item.title}</b><small>{item.tasks.filter((_, taskIndex) => checks[`${index}-${taskIndex}`]).length}/{item.tasks.length}</small></button>)}</aside>
        <section className="stage-panel">
          <span className="eyebrow">第 {stage + 1} 关 · {active.title}</span><h2>{active.mark} {active.title}</h2><p className="stage-description">{active.description}</p>
          <div className="stage-block"><h3>本关检查清单</h3>{active.tasks.map((task, index) => <button className={checks[`${stage}-${index}`] ? "check-row done" : "check-row"} onClick={() => toggle(index)} key={task}><span>{checks[`${stage}-${index}`] ? "✓" : index + 1}</span><b>{task}</b><i>{checks[`${stage}-${index}`] ? "已完成" : "点击完成"}</i></button>)}</div>
          <div className="stage-block"><h3>建议工具</h3><div className="stage-tools">{active.tools.map((tool) => <span key={tool}>{tool}<i>↗</i></span>)}</div></div>
          <div className="stage-nav"><button disabled={stage === 0} onClick={() => setStage(Math.max(0, stage - 1))}>← 上一关</button><span>第 {stage + 1} / {data.journey.length} 关</span><button disabled={stage === data.journey.length - 1} onClick={() => setStage(Math.min(data.journey.length - 1, stage + 1))}>下一关 →</button></div>
        </section>
      </main>
      {guideOpen && <div className="dialog-backdrop"><section className="route-dialog guide-dialog" role="dialog" aria-modal="true"><span className="eyebrow">FIRST VISIT</span><h2>这不是一篇文章，<br />是一套可完成的路线。</h2><p>左侧选择关卡，逐项点击检查清单。完成状态只保存在当前浏览器，不会上传。</p><button className="button primary full" onClick={closeGuide}>开始闯关 →</button><button className="skip-button" onClick={closeGuide}>跳过引导</button></section></div>}
    </>
  );
}

function AboutPage({ copied, onCopy }: { copied: string | null; onCopy: (value: string) => void }) {
  const addresses = [
    ["BTC", "bc1q-eianun-example-address"],
    ["EVM", "0xEianunExampleAddress"],
    ["TRX", "TEianunExampleAddress"],
  ];
  return (
    <>
      <section className="page-hero"><span className="eyebrow">ABOUT EIANUN</span><h1>关于这份指南</h1><p>记录真实操作中遇到的问题、边界和可复用方法，帮助普通人建立自己的出海金融工具箱。</p></section>
      <main className="section about-page">
        <section id="origin"><span className="eyebrow">01 · ORIGIN</span><h2>为什么做这套工具？</h2><p>跨境账户、投资、通讯和数字资产经常被拆成互不相干的教程。EIANUN 把它们重新组织成一条完整路线：先准备基础设施，再建立账户，最后处理投资与资产安全。</p><p>页面不替你做决定，而是把资格、费用、地区限制和下一步写清楚。</p></section>
        <section id="contact"><span className="eyebrow">02 · CONTACT</span><h2>联系方式</h2><p>如果你发现入口失效、规则变化或内容需要修正，可以通过邮箱或 GitHub 提交。</p><div className="contact-box"><span>hello@eianun.example</span><button onClick={() => onCopy("hello@eianun.example")}>{copied === "hello@eianun.example" ? "已复制" : "复制邮箱"}</button></div><a className="button secondary" href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">打开 GitHub ↗</a></section>
        <section id="donate"><span className="eyebrow">03 · SUPPORT</span><h2>支持项目</h2><p>如果这套路线帮你节省了时间，可以用你熟悉的方式支持维护。以下地址是界面占位，正式使用前请替换为真实地址。</p><div className="donate-grid">{addresses.map(([network, address]) => <div key={network}><b>{network}</b><code>{address}</code><button onClick={() => onCopy(address)}>{copied === address ? "已复制" : "复制"}</button></div>)}</div></section>
      </main>
    </>
  );
}

function PartnerPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    ["需要囤货吗？", "不需要。页面按信息分发和服务对接设计，具体合作模式以正式协议为准。"],
    ["收益如何计算？", "根据产品、渠道和结算规则变化，页面只展示计算框架，不承诺固定收益。"],
    ["适合哪些人？", "有真实出境、通讯或跨境服务经验，并愿意持续回答用户问题的人。"],
    ["如何开始？", "先查看产品和服务边界，再通过联系页面提交你的渠道和用户场景。"],
  ];
  return (
    <>
      <section className="partner-hero"><span className="eyebrow">SIDE PROJECT</span><h1>把真实经验，<br /><em>变成可交付的服务。</em></h1><p>围绕跨境通讯、开户流程和工具使用，建立透明、可复核的合作方式。</p><a className="button primary" href="#start">查看合作步骤 →</a></section>
      <main className="section partner-page">
        <SectionHead eyebrow="WHO · 适合谁" title="这些场景最适合开始" note="从你已经做过、能解释清楚的事情开始。" />
        <div className="partner-grid">{["有跨境通讯经验", "熟悉开户材料", "运营内容社群", "能提供售后答疑"].map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>把经验整理为明确步骤、边界和可验证结果。</p></article>)}</div>
        <section className="partner-steps" id="start"><SectionHead eyebrow="HOW · 四步开始" title="完成第一笔合作" note="先把流程跑通，再扩大范围。" /><div>{["选择你熟悉的服务", "确认规则和交付边界", "生成专属入口", "记录结果并持续答疑"].map((item, index) => <span key={item}><i>{index + 1}</i><b>{item}</b></span>)}</div></section>
        <section className="partner-income"><div><span className="eyebrow">CALCULATOR</span><h2>收益是结果，<br />可信交付才是前提。</h2></div><div><b>单次结算</b><strong>¥80–200</strong><p>仅作界面示例，实际金额以合作规则为准。</p></div></section>
        <section className="faq-block"><SectionHead eyebrow="FAQ" title="开始前先问清楚" note="把边界、结算和责任写在前面。" /><div>{faqs.map(([question, answer], index) => <article className={openFaq === index ? "open" : ""} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><b>{question}</b><span>{openFaq === index ? "−" : "+"}</span></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section>
      </main>
    </>
  );
}

function Disclaimer({ onClose }: { onClose: () => void }) {
  return (
    <div className="dialog-backdrop"><section className="route-dialog disclaimer-dialog" role="dialog" aria-modal="true"><span className="eyebrow">READ BEFORE ENTERING</span><h2>先说清楚，再开始。</h2><p>本指南整理公开入口和一般性操作路径，不构成投资、金融、法律或税务建议。服务、费用、地区可用性和政策可能变化，请在使用前自行核验。</p><p>部分入口可能包含推广链接或邀请码，项目可能因此获得佣金，但不代表对任何产品的保证。</p><button className="button primary full" onClick={onClose}>我已了解，进入网站 →</button></section></div>
  );
}

export default function SiteApp({ route: initialRoute }: { route?: string }) {
  const [route, setRoute] = useState(initialRoute || "home");
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    setRoute(initialRoute || routeFromPath(window.location.pathname)); // eslint-disable-line react-hooks/set-state-in-effect
    setDark(window.localStorage.getItem("eianun-theme") === "dark"); // eslint-disable-line react-hooks/set-state-in-effect
    setDisclaimerOpen(!window.sessionStorage.getItem("eianun-disclaimer")); // eslint-disable-line react-hooks/set-state-in-effect
  }, [initialRoute]);

  useEffect(() => {
    window.localStorage.setItem("eianun-theme", dark ? "dark" : "light");
  }, [dark]);

  const copy = async (value: string) => {
    await navigator.clipboard?.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const content = useMemo(() => {
    if (data.categoryPages[route]) return <CategoryPage route={route} copied={copied} onCopy={copy} />;
    if (route === "nifulei-roadmap") return <RoadmapPage />;
    if (route === "nifulei-journey") return <JourneyPage />;
    if (route === "nifulei-about") return <AboutPage copied={copied} onCopy={copy} />;
    if (route === "nifulei-partner") return <PartnerPage />;
    return <HomePage copied={copied} onCopy={copy} />;
  }, [route, copied]);

  const closeDisclaimer = () => {
    window.sessionStorage.setItem("eianun-disclaimer", "1");
    setDisclaimerOpen(false);
  };

  return (
    <div className={dark ? "eianun-site dark" : "eianun-site"}>
      <Header dark={dark} setDark={setDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {content}
      <Footer />
      {disclaimerOpen && <Disclaimer onClose={closeDisclaimer} />}
    </div>
  );
}
