import fs from 'fs';

const historyPath = 'data/history.json';

// 첫 실행인지 확인
const isFirstRun = !fs.existsSync(historyPath);

if (isFirstRun) {
  console.log('First run - initializing with 14 days data...');

  // 파일에서 14일 전체 데이터 읽기
  const trafficData = JSON.parse(fs.readFileSync('temp/traffic.json', 'utf8'));
  const viewsData = JSON.parse(fs.readFileSync('temp/views.json', 'utf8'));

  let totalClones = 0;
  let totalVisitors = 0;
  const daily = [];

  // Clones 데이터 처리
  trafficData.clones.forEach((item) => {
    totalClones += item.count;
    daily.push({
      date: item.timestamp.split('T')[0],
      clones: item.count,
      visitors: 0,
    });
  });

  // Views 데이터 병합
  viewsData.views.forEach((item) => {
    const date = item.timestamp.split('T')[0];
    const existing = daily.find((d) => d.date === date);
    if (existing) {
      existing.visitors = item.uniques;
      totalVisitors += item.uniques;
    }
  });

  const history = {
    totalClones,
    totalVisitors,
    lastUpdate: new Date().toISOString().split('T')[0],
    daily,
  };

  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  console.log(`Initialized: clones=${totalClones}, visitors=${totalVisitors}`);

  // 환경변수로 export
  fs.appendFileSync(process.env.GITHUB_ENV, `TOTAL_CLONES=${totalClones}\n`);
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_VISITORS=${totalVisitors}\n`
  );
} else {
  console.log("History exists - adding today's data...");

  const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  const today = new Date().toISOString().split('T')[0];

  // 오늘 데이터가 이미 있는지 확인
  const todayExists = history.daily.find((d) => d.date === today);

  if (!todayExists) {
    const todayClones = parseInt(process.env.TODAY_CLONES) || 0;
    const todayViews = parseInt(process.env.TODAY_VIEWS) || 0;

    history.totalClones += todayClones;
    history.totalVisitors += todayViews;
    history.lastUpdate = today;

    history.daily.push({
      date: today,
      clones: todayClones,
      visitors: todayViews,
    });

    // 최근 90일만 유지
    if (history.daily.length > 90) {
      history.daily = history.daily.slice(-90);
    }

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log(
      `Updated: clones=${history.totalClones}, visitors=${history.totalVisitors}`
    );
  } else {
    console.log('Today already recorded, skipping...');
  }

  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_CLONES=${history.totalClones}\n`
  );
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_VISITORS=${history.totalVisitors}\n`
  );
}
