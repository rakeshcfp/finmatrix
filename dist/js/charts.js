/* Finmatrix — Native SVG Chart Rendering Library */

// 1. Render Donut/Pie Chart
function renderDonutChart(containerId, data, title) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  if (total <= 0) {
    container.innerHTML = `<div style="color:var(--text-muted);font-size:0.85rem;">Enter values to see chart</div>`;
    return;
  }

  const colors = ['#00d4aa', '#0098ff', '#ff6b35', '#a855f7', '#ec4899'];
  let cumulativePercent = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let slicesSVG = '';
  let legendHTML = '';

  data.forEach((item, index) => {
    if (item.value <= 0) return;
    const percent = item.value / total;
    const dashArray = `${percent * circumference} ${circumference}`;
    const dashOffset = -cumulativePercent * circumference;
    const color = item.color || colors[index % colors.length];

    slicesSVG += `
      <circle cx="50" cy="50" r="${radius}"
        fill="transparent"
        stroke="${color}"
        stroke-width="14"
        stroke-dasharray="${dashArray}"
        stroke-dashoffset="${dashOffset}"
        transform="rotate(-90 50 50)" />
    `;

    cumulativePercent += percent;

    legendHTML += `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;margin-top:4px;">
        <span style="display:flex;align-items:center;gap:6px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};"></span>
          <span>${item.label}</span>
        </span>
        <strong style="font-family:var(--font-mono);">${fmtCurrency(item.value)} (${(percent * 100).toFixed(0)}%)</strong>
      </div>
    `;
  });

  container.innerHTML = `
    ${title ? `<div class="chart-title">${title}</div>` : ''}
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;">
      <svg viewBox="0 0 100 100" style="width:130px;height:130px;transform:rotate(0deg);">
        ${slicesSVG}
      </svg>
      <div style="flex-grow:1;min-width:160px;text-align:left;">
        ${legendHTML}
      </div>
    </div>
  `;
}

// 2. Render Compounding Line/Area Growth Chart
function renderGrowthChart(containerId, yearsArray, valuesArray, title) {
  const container = document.getElementById(containerId);
  if (!container || !valuesArray || valuesArray.length === 0) return;

  const width = 400;
  const height = 160;
  const padding = 25;

  const maxVal = Math.max(...valuesArray, 100);
  const minVal = 0;

  const points = valuesArray.map((val, idx) => {
    const x = padding + (idx / (valuesArray.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ` + points + ` ${width - padding},${height - padding}`;

  const lastVal = valuesArray[valuesArray.length - 1];

  container.innerHTML = `
    ${title ? `<div class="chart-title">${title} — End Value: <strong style="color:var(--accent);">${fmtCurrency(lastVal)}</strong></div>` : ''}
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;max-height:180px;overflow:visible;">
      <!-- Grid lines -->
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border)" stroke-width="1" />
      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="var(--border)" stroke-dasharray="3,3" stroke-width="1" />

      <!-- Area Fill -->
      <polygon points="${areaPoints}" fill="rgba(0, 212, 170, 0.12)" />

      <!-- Growth Line -->
      <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Start Point & End Point Dots -->
      <circle cx="${padding}" cy="${height - padding - ((valuesArray[0] - minVal) / (maxVal - minVal)) * (height - 2 * padding)}" r="4" fill="var(--accent)" />
      <circle cx="${width - padding}" cy="${height - padding - ((lastVal - minVal) / (maxVal - minVal)) * (height - 2 * padding)}" r="5" fill="var(--accent2)" />
    </svg>
    <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:4px;">
      <span>Start (${yearsArray[0] || 'Year 0'})</span>
      <span>Target (${yearsArray[yearsArray.length - 1] || 'Retirement'})</span>
    </div>
  `;
}
