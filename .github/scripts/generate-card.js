import fs from 'fs';

const stats = {
  clones: process.env.TOTAL_CLONES || '0',
  uniqueClones: process.env.TOTAL_UNIQUE_CLONES || '0',
  visitors: process.env.TOTAL_VISITORS || '0',
  uniqueVisitors: process.env.TOTAL_UNIQUE_VISITORS || '0',
};

const svg = `
<svg width="440" height="210" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .card { fill: #0d1117; stroke: #30363d; stroke-width: 1; }
      .title { fill: #e6c07b; font: 600 18px 'Segoe UI', Ubuntu, sans-serif; }
      .label { fill: #8b949e; font: 400 14px 'Segoe UI', Ubuntu, sans-serif; }
      .value { fill: #e06c75; font: 600 14px 'Segoe UI', Ubuntu, sans-serif; }
      .icon { font-size: 16px; }
    </style>
  </defs>
  
  <rect class="card" x="0.5" y="0.5" width="439" height="209" rx="6"/>
  
  <text class="title" x="20" y="35">Next.js Project Setup Stats</text>
  
  <g transform="translate(20, 70)">
    <text class="icon" x="0" y="0">📦</text>
    <text class="label" x="30" y="0">Total Clones:</text>
    <text class="value" x="240" y="0">${stats.clones}</text>
    
    <text class="icon" x="0" y="35">📦</text>
    <text class="label" x="30" y="35">Unique Clones:</text>
    <text class="value" x="240" y="35">${stats.uniqueClones}</text>
    
    <text class="icon" x="0" y="70">👁️</text>
    <text class="label" x="30" y="70">Total Visitors:</text>
    <text class="value" x="240" y="70">${stats.visitors}</text>
    
    <text class="icon" x="0" y="105">👁️</text>
    <text class="label" x="30" y="105">Unique Visitors:</text>
    <text class="value" x="240" y="105">${stats.uniqueVisitors}</text>
  </g>
</svg>
`.trim();

fs.mkdirSync('cards', { recursive: true });
fs.writeFileSync('cards/nextjs-stats.svg', svg);
console.log('Card generated successfully!');
console.log(
  `Stats: clones=${stats.clones} (${stats.uniqueClones} unique), visitors=${stats.visitors} (${stats.uniqueVisitors} unique)`
);
