"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Category = "全部" | "加密交易所" | "冷钱包" | "券商" | "银行卡" | "跨境通讯";
type ScenarioId = "asset" | "market" | "account" | "connect";

type Tool = {
  name: string;
  mark: string;
  category: Exclude<Category, "全部">;
  label: string;
  detail: string;
  code?: string;
  link: string;
};

const categories: Category[] = ["全部", "加密交易所", "冷钱包", "券商", "银行卡", "跨境通讯"];

const tools: Tool[] = [
  { name: "欧易 OKX", mark: "OKX", category: "加密交易所", label: "交易入口", detail: "适合先了解现货、转账与基础资产管理。", code: "SOL999", link: "https://www.okx.com" },
  { name: "币安 Binance", mark: "BNB", category: "加密交易所", label: "多币种入口", detail: "适合需要多币种与长期管理的人。", code: "TALA888", link: "https://www.binance.com" },
  { name: "Bybit", mark: "BB", category: "加密交易所", label: "交易与资产", detail: "把交易、转账和资产入口集中在一起。", code: "NIFULEI20", link: "https://www.bybit.com" },
  { name: "OneKey", mark: "OK", category: "冷钱包", label: "离线保管", detail: "将长期持有的资产从交易平台移出管理。", code: "NIFULEI", link: "https://onekey.so" },
  { name: "SafePal", mark: "SP", category: "冷钱包", label: "硬件钱包", detail: "硬件设备与移动端配合使用的保管方案。", code: "766177", link: "https://www.safepal.com" },
  { name: "Ledger", mark: "LGR", category: "冷钱包", label: "专业保管", detail: "适合建立更严格的私钥与设备管理习惯。", link: "https://www.ledger.com" },
  { name: "盈立证券 uSMART", mark: "U", category: "券商", label: "港美股入口", detail: "把开户、入金与交易的基础问题拆开看。", code: "U02662", link: "https://www.usmart.hk" },
  { name: "Interactive Brokers", mark: "IB", category: "券商", label: "全球市场", detail: "覆盖市场广，适合需要专业工具的人。", link: "https://www.interactivebrokers.com" },
  { name: "Wise", mark: "W", category: "银行卡", label: "多币种转账", detail: "跨境收款、换汇与转账的常见入口。", link: "https://wise.com" },
  { name: "N26", mark: "N26", category: "银行卡", label: "数字银行", detail: "欧洲数字银行方向的账户入口。", code: "yanmingk73062c", link: "https://n26.com" },
  { name: "giffgaff", mark: "GG", category: "跨境通讯", label: "英国号码", detail: "英国号码与流量方案，适合出境连接。", link: "https://www.giffgaff.com" },
  { name: "Eskimo", mark: "ESK", category: "跨境通讯", label: "全球 eSIM", detail: "短期出境和多地区流量的选择之一。", code: "NIFULEI", link: "https://eskimo.travel" },
];

const scenarios: { id: ScenarioId; mark: string; title: string; description: string; category: Exclude<Category, "全部">; summary: string; steps: string[] }[] = [
  { id: "asset", mark: "₿", title: "支付与数字资产", description: "从买入、转账到安全存储，先建立不容易走错的基础路径。", category: "加密交易所", summary: "先解决交易入口，再把长期持有的资产移出平台管理。", steps: ["准备连接与身份环境", "选择交易与充值入口", "建立钱包和备份习惯", "复核费用与地区规则"] },
  { id: "market", mark: "↗", title: "港股与美股账户", description: "整理开户、入金、交易和长期持有之间真正需要的环节。", category: "券商", summary: "把开户、入金、交易和长期持有拆开，不被一张宣传图带着走。", steps: ["确认所在地和账户资格", "比较入金与换汇路径", "选择券商和市场范围", "建立记录与复核习惯"] },
  { id: "account", mark: "▤", title: "海外账户与转账", description: "多币种收款、换汇和跨境转账，找到适合自己的低摩擦组合。", category: "银行卡", summary: "先确认收款和转账需求，再比较币种、费用、限额和地区可用性。", steps: ["明确收款与付款场景", "比较多币种账户入口", "核对换汇和转账费用", "保留交易记录与凭证"] },
  { id: "connect", mark: "⌁", title: "出境连接与号码", description: "eSIM、境外号码与流量，让连接成为基础设施而不是临时救火。", category: "跨境通讯", summary: "连接是所有后续步骤的基础，先准备稳定的号码和网络环境。", steps: ["确认目的地和设备支持", "比较 eSIM 与实体号码", "准备备用连接方案", "出发前做一次真实测试"] },
];

const faqs = [
  { q: "这些工具是投资建议吗？", a: "不是。页面只整理公开入口和一般性使用路径，不构成投资、金融、法律或税务建议。服务条款、费用、地区限制和政策可能变化，请使用前自行核验。" },
  { q: "为什么工具有邀请码？", a: "部分入口可能包含推广链接或邀请码，作者可能因此获得佣金。邀请码不代表对产品的保证，也不改变你需要自行判断的事实。" },
  { q: "我应该从哪里开始？", a: "从首页的场景卡片开始，而不是直接挑品牌。选完场景后，页面会把相关类别筛选出来，再按路线逐步核对。" },
  { q: "我的收藏会上传到服务器吗？", a: "不会。收藏、主题和已读提示只保存在当前浏览器的本地存储中；本页没有接入账户系统。" },
  { q: "500MB 空间够用吗？", a: "够用。本页是轻量静态站，服务器只负责提供已构建的 HTML、CSS 和 JavaScript，不需要在 500MB 服务器上安装 Node.js。" },
];

function copyText(value: string) {
  return navigator.clipboard?.writeText(value);
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("asset");
  const [category, setCategory] = useState<Category>("全部");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  const selectedScenario = scenarios.find((scenario) => scenario.id === activeScenario) ?? scenarios[0];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("eianun-theme");
    const savedFavorites = window.localStorage.getItem("eianun-favorites");
    if (savedTheme === "dark") setDark(true); // eslint-disable-line react-hooks/set-state-in-effect
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites)); // eslint-disable-line react-hooks/set-state-in-effect
    if (window.sessionStorage.getItem("eianun-guide-entered")) setModalOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const visibleTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === "全部" || tool.category === category;
      const matchesQuery = !normalizedQuery || `${tool.name} ${tool.label} ${tool.detail}`.toLowerCase().includes(normalizedQuery);
      const matchesFavorites = !favoritesOnly || favorites.includes(tool.name);
      return matchesCategory && matchesQuery && matchesFavorites;
    });
  }, [category, favorites, favoritesOnly, query]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  function chooseScenario(id: ScenarioId) {
    const scenario = scenarios.find((item) => item.id === id) ?? scenarios[0];
    setActiveScenario(id);
    setCategory(scenario.category);
    setQuery("");
    setFavoritesOnly(false);
    window.setTimeout(() => jump("tool-library"), 40);
  }

  function toggleDark() {
    setDark((value) => {
      const next = !value;
      window.localStorage.setItem("eianun-theme", next ? "dark" : "light");
      return next;
    });
  }

  function toggleFavorite(name: string) {
    setFavorites((current) => {
      const next = current.includes(name) ? current.filter((item) => item !== name) : [...current, name];
      window.localStorage.setItem("eianun-favorites", JSON.stringify(next));
      return next;
    });
  }

  async function copy(value: string) {
    await copyText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1500);
  }

  async function shareRoute() {
    const url = `${window.location.origin}${window.location.pathname}#scenario=${activeScenario}`;
    await copy(url);
    setShareMessage("路线链接已复制");
    window.setTimeout(() => setShareMessage(""), 1800);
  }

  function enterSite() {
    window.sessionStorage.setItem("eianun-guide-entered", "1");
    setModalOpen(false);
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <main className={`eianun-site ${dark ? "dark" : ""}`}>
      <header className="oc-header">
        <button className="oc-brand" onClick={() => jump("top")} aria-label="回到首页"><span className="oc-mark">E</span><span><strong>EIANUN</strong><small>跨境生活行动指南</small></span></button>
        <nav className={menuOpen ? "oc-nav open" : "oc-nav"} aria-label="主导航">
          <button onClick={() => jump("scenarios")}>金融路线图</button><button onClick={() => jump("featured")}>精选专题</button><button onClick={() => jump("tool-library")}>工具库</button><button onClick={() => jump("about")}>关于指南</button>
          <a href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
        <div className="oc-actions"><button className="oc-icon" onClick={toggleDark} aria-label={dark ? "切换浅色模式" : "切换深色模式"}>{dark ? "☼" : "◐"}</button><button className="oc-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="打开菜单">☰</button></div>
      </header>

      <div className="oc-banner"><span>NEW</span> EIANUN 行动指南已重新设计　<a href="#scenarios">从场景开始 →</a><button aria-label="关闭提示">×</button></div>

      <section className="oc-hero" id="top">
        <div className="oc-hero-copy">
          <div className="oc-eyebrow">EIANUN / FIELD GUIDE / 2026</div>
          <h1>把跨境生活，<br /><em>运行起来。</em></h1>
          <p>一个开源、轻量、按场景组织的跨境生活工具箱。先判断你要解决的问题，再拿走对应的路线、入口和下一步。</p>
          <div className="oc-hero-actions"><button className="oc-button primary" onClick={() => jump("scenarios")}>开始一次路线诊断 <span>↘</span></button><a className="oc-button ghost" href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">查看 GitHub <span>↗</span></a></div>
          <div className="oc-hero-meta"><span><b>04</b>核心场景</span><span><b>12</b>工具入口</span><span><b>05</b>路线节点</span></div>
        </div>
        <div className="terminal-card" aria-label="行动路线终端预览"><div className="terminal-bar"><span className="traffic"><i /><i /><i /></span><small>eianun — route</small><span>⌘K</span></div><div className="terminal-body"><p><span className="prompt">$</span> eianun route --goal <b>{selectedScenario.id}</b></p><p className="terminal-muted">正在拆解你的下一步...</p><p className="terminal-success">✓ 场景　{selectedScenario.title}</p><p className="terminal-success">✓ 路线　{selectedScenario.steps[0]} → {selectedScenario.steps[1]}</p><p className="terminal-success">✓ 入口　{selectedScenario.category}</p><p className="terminal-muted cursor-line"><span className="prompt">$</span> 等待你的选择<span className="cursor" /></p></div><div className="terminal-foot"><span>LOCAL / PRIVACY FIRST</span><button onClick={() => jump("scenarios")}>选择场景　↘</button></div></div>
      </section>

      <section className="oc-section" id="scenarios"><div className="oc-section-head"><div><span className="oc-label">01 / START HERE</span><h2>你现在要解决<br /><em>哪一件事？</em></h2></div><p>不要从品牌开始。<br />先从自己的场景开始。</p></div><div className="scenario-grid">{scenarios.map((scenario) => <button key={scenario.id} className={`scenario-card ${activeScenario === scenario.id ? "selected" : ""}`} onClick={() => chooseScenario(scenario.id)}><span className="scenario-number">0{scenarios.indexOf(scenario) + 1}</span><span className="scenario-mark">{scenario.mark}</span><h3>{scenario.title}</h3><p>{scenario.description}</p><span className="scenario-arrow">进入这条路径　↗</span></button>)}</div></section>

      <section className="oc-section featured-section" id="featured"><div className="oc-section-head"><div><span className="oc-label">FEATURED / FIELD NOTES</span><h2>精选专题，<br /><em>独立成篇。</em></h2></div><p>把一个主题讲完整，<br />再回到工具和路径。</p></div><div className="featured-grid"><button onClick={() => { setCategory("冷钱包"); jump("tool-library"); }}><span>▣</span><small>自用指南</small><h3>硬件冷钱包全品牌横评</h3><p>OneKey · Ledger · SafePal · Tangem，先看保管逻辑，再选设备。</p><b>进入专题　↗</b></button><button onClick={() => { setCategory("券商"); jump("tool-library"); }}><span>↗</span><small>新玩法</small><h3>链上美股与全球资产</h3><p>把开户、入金和资产配置拆开，理解每一个入口的边界。</p><b>进入专题　↗</b></button><button onClick={() => { setCategory("加密交易所"); jump("tool-library"); }}><span>₿</span><small>新手必看</small><h3>购买比特币入门路径</h3><p>从交易所、第一笔买入到转出保管，按步骤检查，不跳关。</p><b>进入专题　↗</b></button></div></section>

      <section className="route-section"><div className="route-intro"><span className="oc-label">02 / THE ROUTE</span><h2>{selectedScenario.title}<br /><em>按顺序做。</em></h2><p>{selectedScenario.summary}</p><button className="oc-button primary" onClick={shareRoute}>分享这条路线 <span>↗</span></button>{shareMessage && <small className="share-message">{shareMessage}</small>}</div><div className="route-steps">{selectedScenario.steps.map((step, index) => <button key={step} className={index === 0 ? "current" : ""} onClick={() => { setCategory(index === 1 ? selectedScenario.category : "全部"); jump("tool-library"); }}><span>0{index + 1}</span><div><b>{step}</b><small>{index === 0 ? "当前建议" : "下一步核对"}</small></div><i>↗</i></button>)}</div></section>

      <section className="library-section" id="tool-library"><div className="oc-section tool-wrap"><div className="oc-section-head"><div><span className="oc-label">03 / TOOL LIBRARY</span><h2>把入口放在<br /><em>该出现的地方。</em></h2></div><p>{visibleTools.length} 个结果<br />本地筛选，不上传数据</p></div><div className="library-controls"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具、用途或类别" aria-label="搜索工具" /></div><button className={favoritesOnly ? "filter-button active" : "filter-button"} onClick={() => setFavoritesOnly((value) => !value)}>★ 收藏 {favorites.length}</button><div className="category-pills">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="tool-grid">{visibleTools.length ? visibleTools.map((tool) => { const favorite = favorites.includes(tool.name); return <article className="tool-card" key={tool.name}><div className="tool-card-top"><span className="tool-mark">{tool.mark}</span><button className={favorite ? "favorite active" : "favorite"} onClick={() => toggleFavorite(tool.name)} aria-label={favorite ? `取消收藏 ${tool.name}` : `收藏 ${tool.name}`}>★</button></div><span className="tool-category">{tool.category}</span><h3>{tool.name}</h3><strong>{tool.label}</strong><p>{tool.detail}</p>{tool.code ? <div className="code-row"><span>邀请码 <b>{tool.code}</b></span><button onClick={() => copy(tool.code!)}>{copied === tool.code ? "已复制" : "复制"}</button></div> : <div className="code-row"><span>官方入口</span><a href={tool.link} target="_blank" rel="noreferrer">打开 ↗</a></div>}<a className="tool-link" href={tool.link} target="_blank" rel="noreferrer">查看官方入口　↗</a></article>; }) : <div className="empty-state">没有找到匹配入口。试试清空搜索或切换类别。</div>}</div></div></section>

      <section className="oc-section" id="about"><div className="privacy-card"><div className="privacy-icon">◎</div><div><span className="oc-label">04 / WHY TRUST THIS</span><h2>真实经历，不是搬运。</h2><p>这里记录跨境生活中真实遇到的问题、踩过的坑，以及整理之后可以复用的方法。收藏、主题和筛选结果只保存在你的设备里，不需要注册。</p></div><div className="privacy-stats"><span><b>12</b>工具入口</span><span><b>05</b>路线节点</span><span><b>100%</b>自查提醒</span></div></div></section>

      <section className="oc-section category-index"><div className="oc-section-head"><div><span className="oc-label">EXPLORE / ALL CATEGORIES</span><h2>完整工具库，<br /><em>从这里继续。</em></h2></div><p>四个核心类别，<br />一张路线地图。</p></div><div className="category-index-grid">{scenarios.map((scenario) => <button key={scenario.id} onClick={() => chooseScenario(scenario.id)}><span>{scenario.mark}</span><div><b>{scenario.title}</b><small>{scenario.category} · 相关入口</small></div><i>↗</i></button>)}</div></section>

      <section className="oc-section faq-section" id="faq"><div className="oc-section-head"><div><span className="oc-label">FAQ</span><h2>开始之前，<br /><em>先问清楚。</em></h2></div><p>有些问题没有统一答案，<br />但边界应该先写清楚。</p></div><div className="faq-list">{faqs.map((faq, index) => <div className={faqOpen === index ? "faq-item open" : "faq-item"} key={faq.q}><button onClick={() => setFaqOpen(faqOpen === index ? null : index)}><span>{faq.q}</span><b>{faqOpen === index ? "−" : "+"}</b></button>{faqOpen === index && <p>{faq.a}</p>}</div>)}</div></section>

      <section className="subscribe-section"><div><span className="oc-label">FIELD NOTES</span><h2>想知道下一次更新？</h2><p>留下邮箱，只接收路线、工具和功能更新。没有营销轰炸。</p></div>{subscribed ? <div className="subscribed">✓ 已加入更新列表</div> : <form onSubmit={subscribe}><input required type="email" placeholder="你的邮箱地址" aria-label="邮箱地址" /><button className="oc-button primary">订阅更新　↗</button></form>}</section>

      <footer className="oc-footer"><div className="footer-top"><button className="oc-brand" onClick={() => jump("top")}><span className="oc-mark">E</span><span><strong>EIANUN</strong><small>跨境生活行动指南</small></span></button><div className="footer-links"><a href="#scenarios">金融路线图</a><a href="#featured">精选专题</a><a href="#tool-library">完整工具库</a><a href="#about">关于指南</a><a href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">GitHub ↗</a></div></div><small>© 2026 EIANUN　·　内容仅供参考，不构成投资、金融、法律或税务建议。</small></footer>

      {modalOpen && <div className="oc-modal-backdrop"><section className="oc-modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title"><span className="oc-label">READ BEFORE ENTERING</span><h2 id="disclaimer-title">先说清楚，再开始。</h2><p>本指南基于公开资料与一般性经验整理，仅用于信息参考，不构成投资、金融、法律或税务建议。服务、费用、地区可用性和政策可能变化，请在使用前自行核验。</p><p>页面可能包含推广链接或邀请码，作者可能因此获得佣金，但不代表对任何产品的保证或推荐。</p><button className="oc-button primary full" onClick={enterSite}>我已阅读，进入指南　→</button></section></div>}
    </main>
  );
}
