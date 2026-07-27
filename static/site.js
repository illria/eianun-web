(() => {
  const app = document.getElementById("app");
  const state = {
    data: null,
    route: location.pathname.replace(/^\/+|\/+$/g, "").split("/")[0] || "home",
    dark: localStorage.getItem("eianun-theme") === "dark",
    mobile: false,
    copied: null,
    quickCategory: "crypto",
    brokerView: "list",
    dexFilter: "all",
    expandedDex: null,
    regions: {},
    roadmap: null,
    journeyStage: 0,
    journeyChecks: JSON.parse(localStorage.getItem("eianun-journey") || "{}"),
    guideOpen: !sessionStorage.getItem("eianun-journey-guide"),
    disclaimer: !sessionStorage.getItem("eianun-disclaimer"),
    partnerFaq: 0,
    newsletterStatus: "idle"
  };

  const categoryLabels = { crypto: "加密 Web3", broker: "港美股券商", bank: "国外银行卡", esim: "跨境通讯" };
  const routeCategory = { "nifulei-crypto": "crypto", "nifulei-broker": "broker", "nifulei-bank": "bank", "nifulei-esim": "esim" };
  const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const isExternal = (href) => /^https?:\/\//.test(href);
  const linkAttrs = (href) => isExternal(href) ? ' target="_blank" rel="noreferrer"' : "";

  function header() {
    const nav = state.data.navigation.map((item) => `
      <div class="nav-group">
        <a href="${item.href}">${item.label}<span>⌄</span></a>
        <div class="nav-menu">${item.items.map(([label, href]) => `<a href="${href}">${label}<span>↗</span></a>`).join("")}</div>
      </div>`).join("");
    const offers = [...state.data.offers, ...state.data.offers].map((offer, index) => `<span data-key="${index}">▸ ${offer}</span>`).join("");
    return `
      <header class="site-header">
        <a class="site-brand" href="/"><span class="brand-mark">E</span><span><b>EIANUN</b><small>出海金融行动指南</small></span></a>
        <nav class="main-nav ${state.mobile ? "open" : ""}" aria-label="主导航">${nav}</nav>
        <div class="header-actions">
          <a class="header-follow" href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">GitHub ↗</a>
          <button class="icon-button" data-action="theme" aria-label="${state.dark ? "切换浅色模式" : "切换深色模式"}">${state.dark ? "☼" : "◐"}</button>
          <button class="mobile-button" data-action="mobile" aria-label="打开菜单">${state.mobile ? "×" : "☰"}</button>
        </div>
      </header>
      <div class="offer-strip" aria-label="常用优惠码"><div>${offers}</div></div>`;
  }

  function footer() {
    return `
      <footer class="site-footer">
        <div class="footer-main">
          <a class="site-brand inverted" href="/"><span class="brand-mark">E</span><span><b>EIANUN</b><small>出海金融行动指南</small></span></a>
          <div class="footer-columns">
            <div><b>工具分类</b><a href="/nifulei-bank">国外银行卡</a><a href="/nifulei-broker">港美股券商</a><a href="/nifulei-crypto">加密 Web3</a><a href="/nifulei-esim">跨境通讯</a></div>
            <div><b>路线系统</b><a href="/nifulei-roadmap">金融路线图</a><a href="/nifulei-journey">8 关出海路线</a><a href="/nifulei-about">关于项目</a><a href="/nifulei-partner">副业合伙人</a></div>
            <div><b>项目</b><a href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">GitHub</a><a href="/nifulei-about#contact">联系方式</a><a href="/nifulei-about#donate">支持项目</a></div>
          </div>
        </div>
        <div class="footer-bottom"><span>© 2026 EIANUN</span><span>内容仅供参考，不构成投资、金融、法律或税务建议</span></div>
      </footer>`;
  }

  function sectionHead(eyebrow, title, note) {
    return `<div class="section-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div><p>${note}</p></div>`;
  }

  function toolCard(tool) {
    const region = state.regions[tool.id] || "hk";
    const activeCode = tool.altCode && region === "sg" ? tool.altCode : tool.code;
    const regionSwitch = tool.altCode ? `<div class="region-switch"><button class="${region !== "sg" ? "active" : ""}" data-region="${tool.id}:hk">香港版</button><button class="${region === "sg" ? "active" : ""}" data-region="${tool.id}:sg">新加坡版</button></div>` : "";
    const code = activeCode
      ? `<div class="code-box"><span>${tool.altCode ? (region === "sg" ? "新加坡邀请码" : "香港邀请码") : "邀请码 / 折扣码"} <b>${activeCode}</b></span><button data-copy="${activeCode}">${state.copied === activeCode ? "已复制" : "复制"}</button></div>`
      : `<div class="code-box"><span>官方入口</span><span>无需邀请码</span></div>`;
    const wallets = tool.wallets ? `<button class="wallet-toggle" data-expand="${tool.id}">支持的钱包 <span>${state.expandedDex === tool.id ? "−" : "+"}</span></button>${state.expandedDex === tool.id ? `<div class="wallet-panel">${tool.wallets.map((wallet) => `<span>${wallet}</span>`).join("")}</div>` : ""}` : "";
    return `<article class="resource-card">
      <div class="resource-top"><span class="tool-mark">${tool.mark}</span><div class="resource-badges">${tool.badge ? `<span>${tool.badge}</span>` : ""}<span>★ ${tool.rating}</span></div></div>
      <span class="resource-category">${categoryLabels[tool.category]} · ${tool.label}</span><h3>${tool.name}</h3><p>${tool.detail}</p>
      ${regionSwitch}${code}${wallets}
      <a class="resource-link" href="${tool.link}"${linkAttrs(tool.link)}>${tool.category === "broker" ? "立即开户" : tool.category === "esim" ? "立即获取" : "查看官方入口"} <span>↗</span></a>
    </article>`;
  }

  function homePage() {
    const quickTools = state.data.tools.filter((tool) => tool.category === state.quickCategory).slice(0, 4);
    const map = state.data.roadmap.slice(0, 5).map((item, index) => `<a href="${item.href}" class="mini-route"><span>${item.mark}</span><div><b>${item.title}</b><small>${item.summary}</small></div><i>${index === 4 ? "✓" : "↓"}</i></a>`).join("");
    const categories = Object.entries(categoryLabels).map(([key, label]) => `<button class="${state.quickCategory === key ? "active" : ""}" data-quick="${key}">${label}</button>`).join("");
    const journey = state.data.journey.map((stage, index) => `<span><i>${index + 1}</i>${stage.title}</span>`).join("");
    return `
      <section class="home-hero">
        <div class="hero-copy"><span class="eyebrow">EIANUN · 出海金融操作系统</span><h1>普通人的<br><em>全球资金通关图</em></h1><p>不是一张工具清单，而是从网络、账户、投资到资产保管的完整行动路径。先选择你要解决的问题，再拿走对应步骤和入口。</p>
        <div class="hero-actions"><a class="button primary" href="/nifulei-journey">开始闯关 · 8 步路线 <span>→</span></a><a class="button secondary" href="#needs">选择场景 <span>↓</span></a></div>
        <div class="hero-stats"><span><b>40+</b>工具入口</span><span><b>08</b>核心页面</span><span><b>08</b>闯关步骤</span></div></div>
        <div class="hero-map" aria-label="出海行动路线预览"><div class="map-head"><span>route://eianun</span><span>READY</span></div>${map}</div>
      </section>
      <section class="section" id="needs">${sectionHead("STEP 01 · 选择场景", "你想解决什么问题？", "从场景出发，避免被品牌列表带着走。")}
        <div class="need-grid">
          ${[
            ["₿", "买加密货币 · 保护资产", "建立交易入口、钱包和长期资产保管路径。", "/nifulei-crypto"],
            ["📈", "投资港股 · 美股", "完成券商开户、入金和全球市场配置。", "/nifulei-broker"],
            ["🏦", "建立海外银行账户", "持有外币、跨境收付款和连接投资账户。", "/nifulei-bank"],
            ["📡", "解决出境上网", "准备境外号码、旅行流量和写卡方案。", "/nifulei-esim"]
          ].map(([mark, title, text, href], index) => `<a class="need-card" href="${href}"><span class="need-index">0${index + 1}</span><b class="need-mark">${mark}</b><h3>${title}</h3><p>${text}</p><strong>查看完整路径 <span>→</span></strong></a>`).join("")}
        </div>
      </section>
      <section class="section featured-block">${sectionHead("FEATURED · 精选专题", "独立专题与实用路线", "把一个问题讲完整，再回到工具入口。")}
        <div class="feature-grid">
          <a href="/nifulei-crypto#cold"><span>SECURITY</span><b>🔒</b><h3>硬件冷钱包选购与备份</h3><p>比较 OneKey、Ledger、SafePal 与 Tangem，先建立私钥保管逻辑。</p><strong>进入专题 ↗</strong></a>
          <a href="/nifulei-broker#chain"><span>NEW MARKET</span><b>📈</b><h3>链上美股与全球资产</h3><p>理解代币化股票、钱包连接和资产发行边界。</p><strong>进入专题 ↗</strong></a>
          <a href="/nifulei-journey"><span>START HERE</span><b>🚀</b><h3>8 关出海行动路线</h3><p>网络、号码、账户、券商、交易所、支付卡与冷钱包逐步完成。</p><strong>开始闯关 ↗</strong></a>
        </div>
      </section>
      <section class="section quick-tools">${sectionHead("STEP 02 · 立即行动", "新人常用工具", "分类切换、复制邀请码并进入官方页面。")}
        <div class="category-tabs" role="tablist">${categories}</div><div class="resource-grid compact">${quickTools.map(toolCard).join("")}</div>
        <a class="text-link" href="/nifulei-${state.quickCategory === "esim" ? "esim" : state.quickCategory}">查看该分类完整工具库 →</a>
      </section>
      <section class="trust-section"><div><span class="eyebrow">STEP 03 · 使用原则</span><h2>真实经历，<br>不是搬运。</h2><p>页面围绕真实操作中会遇到的资格、费用、入金、转账和安全问题组织。入口会变化，使用前请再次核验地区和最新条款。</p></div><div class="trust-stats"><span><b>40+</b>工具入口</span><span><b>04</b>核心分类</span><span><b>08</b>闯关步骤</span><span><b>100%</b>本地进度</span></div></section>
      <section class="section">${sectionHead("EXPLORE · 全部栏目", "完整功能入口", "分类页、路线图与项目说明均可独立访问。")}
        <div class="explore-grid">${[
          ["🏦", "国外银行卡", "国际账户 · 香港银行 · 美国企业账户", "/nifulei-bank"],
          ["📈", "港美股券商", "券商列表 · 综合排名 · 链上美股", "/nifulei-broker"],
          ["₿", "加密 Web3", "交易所 · DEX · 支付卡 · 冷热钱包", "/nifulei-crypto"],
          ["📡", "跨境通讯", "境外号码 · 流量平台 · eSIM 写卡器", "/nifulei-esim"],
          ["🗺", "金融路线图", "点击节点查看资金路径与下一步", "/nifulei-roadmap"],
          ["🚀", "出海路线图", "8 关进度 · 清单 · 本地保存", "/nifulei-journey"]
        ].map(([mark, title, text, href]) => `<a href="${href}"><b>${mark}</b><div><h3>${title}</h3><p>${text}</p></div><span>↗</span></a>`).join("")}</div>
      </section>
      <section class="journey-teaser"><div><span class="eyebrow">8-STAGE JOURNEY</span><h2>从零到全球通</h2><p>网络 → 应用环境 → 境外号码 → 银行账户 → 港美股 → 交易所 → 支付卡 → 冷钱包</p><a class="button primary" href="/nifulei-journey">开始闯关 →</a></div><div class="teaser-stages">${journey}</div></section>
      <section class="newsletter-section">
        <div><span class="eyebrow">FIELD NOTES · 邮箱订阅</span><h2>想知道下一次更新？</h2><p>留下邮箱，只接收路线、工具和功能更新。当前版本先在本设备保存订阅偏好，接入邮件服务后可直接迁移。</p></div>
        <form data-newsletter><label for="newsletter-email">邮箱地址</label><div><input id="newsletter-email" name="email" type="email" required placeholder="you@example.com" autocomplete="email"><button type="submit">${state.newsletterStatus === "saved" ? "已保存 ✓" : "订阅更新 →"}</button></div><small>${state.newsletterStatus === "saved" ? "订阅偏好已保存在当前浏览器。" : "不发送营销轰炸；正式投递接口尚未接入。"}</small></form>
      </section>`;
  }

  function categoryPage(route) {
    const page = state.data.categoryPages[route];
    const category = routeCategory[route];
    const anchors = page.groups.map(([id, title]) => `<a href="#${id}">${title}<span>↓</span></a>`).join("");
    const sections = page.groups.map(([group, title, description], groupIndex) => {
      let tools = state.data.tools.filter((tool) => tool.category === category && tool.group === group);
      if (group === "dex" && state.dexFilter !== "all") tools = tools.filter((tool) => tool.kind === state.dexFilter);
      const viewTabs = route === "nifulei-broker" && group === "hk"
        ? `<div class="view-tabs"><button class="${state.brokerView === "list" ? "active" : ""}" data-broker-view="list">券商列表</button><button class="${state.brokerView === "rank" ? "active" : ""}" data-broker-view="rank">综合排名</button></div>`
        : route === "nifulei-crypto" && group === "dex"
          ? `<div class="view-tabs"><button class="${state.dexFilter === "all" ? "active" : ""}" data-dex="all">全部</button><button class="${state.dexFilter === "spot" ? "active" : ""}" data-dex="spot">现货 / AMM</button><button class="${state.dexFilter === "perp" ? "active" : ""}" data-dex="perp">永续合约</button></div>`
          : "";
      const ranking = `<div class="ranking-table"><div class="rank-row rank-head"><span>排名</span><span>平台</span><span>类型</span><span>评分</span><span>特点</span></div>${state.data.brokerRanking.map((row) => `<div class="rank-row">${row.map((cell) => `<span>${cell}</span>`).join("")}</div>`).join("")}</div>`;
      const body = route === "nifulei-broker" && group === "hk" && state.brokerView === "rank" ? ranking : `<div class="resource-grid">${tools.map(toolCard).join("")}</div>`;
      return `<section class="resource-section" id="${group}"><div class="resource-section-head"><div><span>${String(groupIndex + 1).padStart(2, "0")}</span><h2>${title}</h2></div><p>${description}</p></div>${viewTabs}${body}</section>`;
    }).join("");
    return `<section class="page-hero"><span class="eyebrow">${page.eyebrow}</span><h1>${page.title}</h1><p>${page.description}</p><div class="anchor-nav">${anchors}</div></section><main class="section page-content">${sections}</main>`;
  }

  function roadmapPage() {
    const flow = state.data.roadmap.map((item, index) => `<button data-roadmap="${item.id}"><span>${item.mark}</span><div><h3>${item.title}</h3><p>${item.summary}</p></div><i>${index === state.data.roadmap.length - 1 ? "✓" : "→"}</i></button>`).join("");
    return `<section class="page-hero"><span class="eyebrow">FINANCE MAP</span><h1>金融路线图</h1><p>点击任意节点，查看这一步的作用、风险和下一步入口。</p></section><main class="section roadmap-page">${sectionHead("PATH 01 · 从基础设施开始", "无海外账户用户路线", "网络与号码 → 交易所 → 海外账户 → 券商 → 冷钱包 → 资金流转")}<div class="roadmap-flow">${flow}</div><div class="route-notes"><article><b>入金路线</b><p>本地资金 → 合规换汇 → 海外账户 → 券商或交易所</p></article><article><b>退出路线</b><p>平台资产 → 银行账户 → 合规换汇 → 本地账户</p></article><article><b>备用路线</b><p>始终保留第二账户、第二网络和小额测试路径</p></article></div></main>`;
  }

  function journeyPage() {
    const active = state.data.journey[state.journeyStage];
    const total = state.data.journey.reduce((sum, item) => sum + item.tasks.length, 0);
    const completed = Object.values(state.journeyChecks).filter(Boolean).length;
    const pct = Math.round((completed / total) * 100);
    const sidebar = state.data.journey.map((item, index) => `<button class="${state.journeyStage === index ? "active" : ""}" data-stage="${index}"><span>${index + 1}</span><i>${item.mark}</i><b>${item.title}</b><small>${item.tasks.filter((_, taskIndex) => state.journeyChecks[`${index}-${taskIndex}`]).length}/${item.tasks.length}</small></button>`).join("");
    const checks = active.tasks.map((task, index) => { const done = state.journeyChecks[`${state.journeyStage}-${index}`]; return `<button class="check-row ${done ? "done" : ""}" data-check="${index}"><span>${done ? "✓" : index + 1}</span><b>${task}</b><i>${done ? "已完成" : "点击完成"}</i></button>`; }).join("");
    const tools = active.tools.map((tool) => `<span>${tool}<i>↗</i></span>`).join("");
    return `<section class="journey-header"><span class="eyebrow">8-STAGE JOURNEY</span><h1>出海路线图</h1><p>每一关都有目标、检查清单和工具入口，进度仅保存在当前设备。</p><div class="overall-progress"><span><b>${completed}</b> / ${total} 项完成</span><span>${pct}%</span><i><b style="width:${pct}%"></b></i></div></section><main class="journey-layout"><aside class="stage-sidebar">${sidebar}</aside><section class="stage-panel"><span class="eyebrow">第 ${state.journeyStage + 1} 关 · ${active.title}</span><h2>${active.mark} ${active.title}</h2><p class="stage-description">${active.description}</p><div class="stage-block"><h3>本关检查清单</h3>${checks}</div><div class="stage-block"><h3>建议工具</h3><div class="stage-tools">${tools}</div></div><div class="stage-nav"><button data-stage="${Math.max(0, state.journeyStage - 1)}" ${state.journeyStage === 0 ? "disabled" : ""}>← 上一关</button><span>第 ${state.journeyStage + 1} / ${state.data.journey.length} 关</span><button data-stage="${Math.min(state.data.journey.length - 1, state.journeyStage + 1)}" ${state.journeyStage === state.data.journey.length - 1 ? "disabled" : ""}>下一关 →</button></div></section></main>`;
  }

  function aboutPage() {
    const addresses = [["BTC", "bc1q-eianun-example-address"], ["EVM", "0xEianunExampleAddress"], ["TRX", "TEianunExampleAddress"]];
    return `<section class="page-hero"><span class="eyebrow">ABOUT EIANUN</span><h1>关于这份指南</h1><p>记录真实操作中遇到的问题、边界和可复用方法，帮助普通人建立自己的出海金融工具箱。</p></section><main class="section about-page"><section id="origin"><span class="eyebrow">01 · ORIGIN</span><h2>为什么做这套工具？</h2><p>跨境账户、投资、通讯和数字资产经常被拆成互不相干的教程。EIANUN 把它们重新组织成一条完整路线：先准备基础设施，再建立账户，最后处理投资与资产安全。</p><p>页面不替你做决定，而是把资格、费用、地区限制和下一步写清楚。</p></section><section id="contact"><span class="eyebrow">02 · CONTACT</span><h2>联系方式</h2><p>如果你发现入口失效、规则变化或内容需要修正，可以通过邮箱或 GitHub 提交。</p><div class="contact-box"><span>hello@eianun.example</span><button data-copy="hello@eianun.example">${state.copied === "hello@eianun.example" ? "已复制" : "复制邮箱"}</button></div><a class="button secondary" href="https://github.com/illria/eianun-web" target="_blank" rel="noreferrer">打开 GitHub ↗</a></section><section id="donate"><span class="eyebrow">03 · SUPPORT</span><h2>支持项目</h2><p>以下地址是界面占位，正式使用前请替换为真实地址。</p><div class="donate-grid">${addresses.map(([network, address]) => `<div><b>${network}</b><code>${address}</code><button data-copy="${address}">${state.copied === address ? "已复制" : "复制"}</button></div>`).join("")}</div></section></main>`;
  }

  function partnerPage() {
    const faqs = [["需要囤货吗？", "不需要。页面按信息分发和服务对接设计，具体合作模式以正式协议为准。"], ["收益如何计算？", "根据产品、渠道和结算规则变化，页面只展示计算框架，不承诺固定收益。"], ["适合哪些人？", "有真实出境、通讯或跨境服务经验，并愿意持续回答用户问题的人。"], ["如何开始？", "先查看产品和服务边界，再通过联系页面提交你的渠道和用户场景。"]];
    return `<section class="partner-hero"><span class="eyebrow">SIDE PROJECT</span><h1>把真实经验，<br><em>变成可交付的服务。</em></h1><p>围绕跨境通讯、开户流程和工具使用，建立透明、可复核的合作方式。</p><a class="button primary" href="#start">查看合作步骤 →</a></section><main class="section partner-page">${sectionHead("WHO · 适合谁", "这些场景最适合开始", "从你已经做过、能解释清楚的事情开始。")}<div class="partner-grid">${["有跨境通讯经验", "熟悉开户材料", "运营内容社群", "能提供售后答疑"].map((item, index) => `<article><span>0${index + 1}</span><h3>${item}</h3><p>把经验整理为明确步骤、边界和可验证结果。</p></article>`).join("")}</div><section class="partner-steps" id="start">${sectionHead("HOW · 四步开始", "完成第一笔合作", "先把流程跑通，再扩大范围。")}<div>${["选择你熟悉的服务", "确认规则和交付边界", "生成专属入口", "记录结果并持续答疑"].map((item, index) => `<span><i>${index + 1}</i><b>${item}</b></span>`).join("")}</div></section><section class="partner-income"><div><span class="eyebrow">CALCULATOR</span><h2>收益是结果，<br>可信交付才是前提。</h2></div><div><b>单次结算</b><strong>¥80–200</strong><p>仅作界面示例，实际金额以合作规则为准。</p></div></section><section class="faq-block">${sectionHead("FAQ", "开始前先问清楚", "把边界、结算和责任写在前面。")}<div>${faqs.map(([question, answer], index) => `<article class="${state.partnerFaq === index ? "open" : ""}"><button data-partner-faq="${index}"><b>${question}</b><span>${state.partnerFaq === index ? "−" : "+"}</span></button>${state.partnerFaq === index ? `<p>${answer}</p>` : ""}</article>`).join("")}</div></section></main>`;
  }

  function overlays() {
    let html = "";
    if (state.roadmap) {
      const item = state.data.roadmap.find((entry) => entry.id === state.roadmap);
      html += `<div class="dialog-backdrop" data-action="close-roadmap"><section class="route-dialog" role="dialog" aria-modal="true"><button class="dialog-close" data-action="close-roadmap">×</button><span class="tool-mark">${item.mark}</span><h2>${item.title}</h2><p>${item.detail}</p><a class="button primary" href="${item.href}">进入对应工具页 →</a></section></div>`;
    }
    if (state.route === "nifulei-journey" && state.guideOpen) {
      html += `<div class="dialog-backdrop"><section class="route-dialog guide-dialog" role="dialog" aria-modal="true"><span class="eyebrow">FIRST VISIT</span><h2>这不是一篇文章，<br>是一套可完成的路线。</h2><p>左侧选择关卡，逐项点击检查清单。完成状态只保存在当前浏览器，不会上传。</p><button class="button primary full" data-action="close-guide">开始闯关 →</button><button class="skip-button" data-action="close-guide">跳过引导</button></section></div>`;
    }
    if (state.disclaimer) {
      html += `<div class="dialog-backdrop"><section class="route-dialog disclaimer-dialog" role="dialog" aria-modal="true"><span class="eyebrow">READ BEFORE ENTERING</span><h2>先说清楚，再开始。</h2><p>本指南整理公开入口和一般性操作路径，不构成投资、金融、法律或税务建议。服务、费用、地区可用性和政策可能变化，请在使用前自行核验。</p><p>部分入口可能包含推广链接或邀请码，项目可能因此获得佣金，但不代表对任何产品的保证。</p><button class="button primary full" data-action="close-disclaimer">我已了解，进入网站 →</button></section></div>`;
    }
    return html;
  }

  function page() {
    if (state.data.categoryPages[state.route]) return categoryPage(state.route);
    if (state.route === "nifulei-roadmap") return roadmapPage();
    if (state.route === "nifulei-journey") return journeyPage();
    if (state.route === "nifulei-about") return aboutPage();
    if (state.route === "nifulei-partner") return partnerPage();
    return homePage();
  }

  function render() {
    app.innerHTML = `<div class="eianun-site ${state.dark ? "dark" : ""}">${header()}${page()}${footer()}${overlays()}</div>`;
  }

  async function copy(value) {
    await navigator.clipboard?.writeText(value);
    state.copied = value;
    render();
    setTimeout(() => { if (state.copied === value) { state.copied = null; render(); } }, 1500);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action],[data-copy],[data-quick],[data-broker-view],[data-dex],[data-expand],[data-region],[data-roadmap],[data-stage],[data-check],[data-partner-faq]");
    if (!target) return;
    if (target.dataset.action === "theme") { state.dark = !state.dark; localStorage.setItem("eianun-theme", state.dark ? "dark" : "light"); }
    if (target.dataset.action === "mobile") state.mobile = !state.mobile;
    if (target.dataset.action === "close-disclaimer") { state.disclaimer = false; sessionStorage.setItem("eianun-disclaimer", "1"); }
    if (target.dataset.action === "close-roadmap") state.roadmap = null;
    if (target.dataset.action === "close-guide") { state.guideOpen = false; sessionStorage.setItem("eianun-journey-guide", "1"); }
    if (target.dataset.copy) { copy(target.dataset.copy); return; }
    if (target.dataset.quick) state.quickCategory = target.dataset.quick;
    if (target.dataset.brokerView) state.brokerView = target.dataset.brokerView;
    if (target.dataset.dex) state.dexFilter = target.dataset.dex;
    if (target.dataset.expand) state.expandedDex = state.expandedDex === target.dataset.expand ? null : target.dataset.expand;
    if (target.dataset.region) { const [id, region] = target.dataset.region.split(":"); state.regions[id] = region; }
    if (target.dataset.roadmap) state.roadmap = target.dataset.roadmap;
    if (target.dataset.stage !== undefined) state.journeyStage = Number(target.dataset.stage);
    if (target.dataset.check !== undefined) { const key = `${state.journeyStage}-${target.dataset.check}`; state.journeyChecks[key] = !state.journeyChecks[key]; localStorage.setItem("eianun-journey", JSON.stringify(state.journeyChecks)); }
    if (target.dataset.partnerFaq !== undefined) state.partnerFaq = state.partnerFaq === Number(target.dataset.partnerFaq) ? -1 : Number(target.dataset.partnerFaq);
    render();
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-newsletter]");
    if (!form) return;
    event.preventDefault();
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) return;
    localStorage.setItem("eianun-newsletter-email", email);
    state.newsletterStatus = "saved";
    render();
  });

  const scriptUrl = document.currentScript?.src || document.baseURI;
  fetch(new URL("site-data.json", scriptUrl))
    .then((response) => {
      if (!response.ok) throw new Error(`data ${response.status}`);
      return response.json();
    })
    .then((data) => { state.data = data; render(); })
    .catch((error) => {
      app.innerHTML = `<main style="font-family:system-ui;padding:40px"><h1>页面数据加载失败</h1><p>${esc(error.message)}</p></main>`;
    });
})();
