import fs from 'fs';

const stats = {
  clones: process.env.CLONES || '0',
  visitors: process.env.VIEWS || '0',
  stars: process.env.STARS || '0',
  forks: process.env.FORKS || '0',
};

const svg = `
<svg width="440" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .card { fill: #0d1117; stroke: #30363d; stroke-width: 1; }
      .title { fill: #e6c07b; font: 600 18px 'Segoe UI', Ubuntu, sans-serif; }
      .label { fill: #8b949e; font: 400 14px 'Segoe UI', Ubuntu, sans-serif; }
      .value { fill: #e06c75; font: 600 14px 'Segoe UI', Ubuntu, sans-serif; }
      .icon { fill: #58a6ff; }
    </style>
  </defs>
  
  <rect class="card" x="0.5" y="0.5" width="439" height="179" rx="6"/>
  
  <!-- Title -->
  <text class="title" x="20" y="35">Next.js Project Setup Stats</text>
  
  <!-- Stats -->
  <g transform="translate(20, 65)">
    <!-- Clones -->
    <text class="icon" x="0" y="0">📦</text>
    <text class="label" x="30" y="0">Total Clones (14 days):</text>
    <text class="value" x="240" y="0">${stats.clones}</text>
    
    <!-- Visitors -->
    <text class="icon" x="0" y="28">👁️</text>
    <text class="label" x="30" y="28">Unique Visitors:</text>
    <text class="value" x="240" y="28">${stats.visitors}</text>
    
    <!-- Stars -->
    <text class="icon" x="0" y="56">⭐</text>
    <text class="label" x="30" y="56">Total Stars:</text>
    <text class="value" x="240" y="56">${stats.stars}</text>
    
    <!-- Forks -->
    <text class="icon" x="0" y="84">🔱</text>
    <text class="label" x="30" y="84">Total Forks:</text>
    <text class="value" x="240" y="84">${stats.forks}</text>
  </g>
</svg>
`.trim();

fs.mkdirSync('cards', { recursive: true });
fs.writeFileSync('cards/nextjs-stats.svg', svg);
console.log('Card generated successfully!');
