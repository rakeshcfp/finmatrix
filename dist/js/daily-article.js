/* Finmatrix — Daily Trending Article & Guide Automation Engine */

const TRENDING_TOPICS_DATABASE = [
  {
    id: "hysa-cd",
    title: "Fed Interest Rate Alert: High-Yield Savings vs. 12-Month CDs",
    summary: "Online banks are adjusting APYs. Here is how to lock in 4.5%+ guaranteed yield before the next Federal Reserve rate decision.",
    link: "hysa-vs-cd-2025.html",
    tag: "HYSA / Rates",
    readTime: "5 min read",
    highlight: "Top APY Move Today"
  },
  {
    id: "rent-buy",
    title: "2026 US Real Estate Reality Check: Price-to-Rent Ratio Breakdown",
    summary: "With 30-year fixed mortgages hovering near 6.5%, renting and investing the monthly cash flow difference is outpacing buying in 32 US metro markets.",
    link: "rent-vs-buy-2025.html",
    tag: "Housing & Mortgage",
    readTime: "8 min read",
    highlight: "Real Estate Alert"
  },
  {
    id: "side-hustle",
    title: "7 Remote Side Hustles Generating $1,000/Month Extra Income",
    summary: "Discover legitimate US freelance, tutoring, and micro-SaaS opportunities to pay down high-interest debt or max out your 2026 Roth IRA.",
    link: "side-hustles-1000-month.html",
    tag: "Side Income",
    readTime: "6 min read",
    highlight: "Income Boost"
  },
  {
    id: "roth-ira",
    title: "Roth IRA 2025/2026 Strategy: Maximize $7,000 Tax-Free Growth",
    summary: "Why contributing $583/month to a Roth IRA early in the year gives your portfolio an extra decade of compound growth.",
    link: "roth-ira-vs-401k.html",
    tag: "Tax Strategy",
    readTime: "7 min read",
    highlight: "IRS Limit Guide"
  },
  {
    id: "credit-score",
    title: "The 10% Credit Utilization Hack: Boost Your FICO Score Fast",
    summary: "Paying credit card balances 48 hours BEFORE your statement closing date can jump your score 20–40 points in a single reporting cycle.",
    link: "boost-credit-score-30-days.html",
    tag: "Credit Score",
    readTime: "5 min read",
    highlight: "FICO Hack"
  },
  {
    id: "emergency-fund",
    title: "Building a Bulletproof 6-Month Emergency Cushion",
    summary: "How to insulate your family from unexpected job changes or medical bills without touching high-interest credit cards.",
    link: "how-to-build-emergency-fund.html",
    tag: "Savings",
    readTime: "6 min read",
    highlight: "Safety Net"
  },
  {
    id: "fire-4pct",
    title: "The 4% Safe Withdrawal Rule for Early Retirement & FIRE",
    summary: "Based on the Trinity Study, calculate your exact Financial Independence target multiplier (25x expenses).",
    link: "what-is-the-4-percent-rule.html",
    tag: "FIRE Movement",
    readTime: "6 min read",
    highlight: "Early Retirement"
  }
];

// Helper to compute time remaining until midnight
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = midnight - now;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

// Get Today's Dynamic Featured Article
function getTodayFeaturedTopic() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const index = dayOfYear % TRENDING_TOPICS_DATABASE.length;
  return {
    topic: TRENDING_TOPICS_DATABASE[index],
    dayOfYear: dayOfYear,
    todayDateStr: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  };
}

// Render Daily Featured Topic Spotlight Banner
function renderDailyFeaturedTopicBanner(containerId, isSubfolder = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { topic, todayDateStr } = getTodayFeaturedTopic();
  const timeRemaining = getTimeUntilMidnight();
  const articleLink = isSubfolder ? topic.link : 'articles/' + topic.link;

  container.innerHTML = `
    <div style="background:linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,152,255,0.08));border:1px solid var(--accent);border-radius:var(--radius);padding:28px;margin-bottom:36px;position:relative;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#ff4757;box-shadow:0 0 10px #ff4757;display:inline-block;animation:pulse 1.5s infinite;"></span>
          <span class="chip orange" style="font-size:0.7rem;font-weight:700;">🔥 TODAY'S TRENDING FEATURED TOPIC</span>
          <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">(${todayDateStr})</span>
        </div>
        <span style="font-size:0.75rem;color:var(--accent);background:var(--bg3);padding:4px 10px;border-radius:100px;border:1px solid var(--border);">⏱ Next Topic in ${timeRemaining}</span>
      </div>

      <h2 style="font-family:var(--font-heading);font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:var(--text);">${topic.title}</h2>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:760px;margin-bottom:20px;line-height:1.6;">${topic.summary}</p>
      
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <a href="${articleLink}" class="btn-primary" style="padding:10px 20px;font-size:0.9rem;">Read Today's Trending Guide →</a>
        <span style="font-size:0.8rem;color:var(--text-muted);">⏱ ${topic.readTime} · Category: <strong style="color:var(--accent);">${topic.tag}</strong></span>
      </div>
    </div>
  `;
}
