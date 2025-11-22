import fs from 'fs';

const historyPath = 'data/history.json';

// 첫 실행인지 확인
const isFirstRun = !fs.existsSync(historyPath);

if (isFirstRun) {
  console.log('First run - initializing with 14 days data...');

  // 파일에서 14일 전체 데이터 읽기
  const trafficData = JSON.parse(fs.readFileSync('temp/traffic.json', 'utf8'));
  const viewsData = JSON.parse(fs.readFileSync('temp/views.json', 'utf8'));

  console.log('Traffic data:', JSON.stringify(trafficData, null, 2));
  console.log('Views data:', JSON.stringify(viewsData, null, 2));

  let totalClones = 0;
  let totalUniqueClones = 0;
  let totalVisitors = 0;
  let totalUniqueVisitors = 0;
  const daily = [];

  // Clones 데이터 처리
  if (trafficData.clones && Array.isArray(trafficData.clones)) {
    console.log(`Processing ${trafficData.clones.length} days of clone data`);
    trafficData.clones.forEach((item) => {
      console.log(
        `Date: ${item.timestamp}, Clones: ${item.count}, Uniques: ${item.uniques}`
      );
      totalClones += item.count;
      totalUniqueClones += item.uniques;
      daily.push({
        date: item.timestamp.split('T')[0],
        clones: item.count,
        uniqueClones: item.uniques,
        visitors: 0,
        uniqueVisitors: 0,
      });
    });
  } else {
    console.error('No clones data found!');
  }

  // Views 데이터 병합
  if (viewsData.views && Array.isArray(viewsData.views)) {
    console.log(`Processing ${viewsData.views.length} days of view data`);
    viewsData.views.forEach((item) => {
      console.log(
        `Date: ${item.timestamp}, Views: ${item.count}, Uniques: ${item.uniques}`
      );
      const date = item.timestamp.split('T')[0];
      const existing = daily.find((d) => d.date === date);
      if (existing) {
        existing.visitors = item.count;
        existing.uniqueVisitors = item.uniques;
        totalVisitors += item.count;
        totalUniqueVisitors += item.uniques;
      }
    });
  } else {
    console.error('No views data found!');
  }

  console.log(
    `Final totals: clones=${totalClones}, uniqueClones=${totalUniqueClones}, visitors=${totalVisitors}, uniqueVisitors=${totalUniqueVisitors}`
  );

  const history = {
    totalClones,
    totalUniqueClones,
    totalVisitors,
    totalUniqueVisitors,
    lastUpdate: new Date().toISOString().split('T')[0],
    daily,
  };

  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  console.log(`Initialized with full stats`);

  // 환경변수로 export
  fs.appendFileSync(process.env.GITHUB_ENV, `TOTAL_CLONES=${totalClones}\n`);
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_UNIQUE_CLONES=${totalUniqueClones}\n`
  );
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_VISITORS=${totalVisitors}\n`
  );
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_UNIQUE_VISITORS=${totalUniqueVisitors}\n`
  );
} else {
  console.log("History exists - adding today's data...");

  const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  const today = new Date().toISOString().split('T')[0];

  // 오늘 데이터가 이미 있는지 확인
  const todayExists = history.daily.find((d) => d.date === today);

  if (!todayExists) {
    const todayClones = parseInt(process.env.TODAY_CLONES) || 0;
    const todayUniqueClones = parseInt(process.env.TODAY_UNIQUE_CLONES) || 0;
    const todayViews = parseInt(process.env.TODAY_VIEWS) || 0;
    const todayUniqueViews = parseInt(process.env.TODAY_UNIQUE_VIEWS) || 0;

    history.totalClones += todayClones;
    history.totalUniqueClones += todayUniqueClones;
    history.totalVisitors += todayViews;
    history.totalUniqueVisitors += todayUniqueViews;
    history.lastUpdate = today;

    history.daily.push({
      date: today,
      clones: todayClones,
      uniqueClones: todayUniqueClones,
      visitors: todayViews,
      uniqueVisitors: todayUniqueViews,
    });

    // 최근 90일만 유지
    if (history.daily.length > 90) {
      history.daily = history.daily.slice(-90);
    }

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log(
      `Updated: clones=${history.totalClones}, uniqueClones=${history.totalUniqueClones}, visitors=${history.totalVisitors}, uniqueVisitors=${history.totalUniqueVisitors}`
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
    `TOTAL_UNIQUE_CLONES=${history.totalUniqueClones}\n`
  );
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_VISITORS=${history.totalVisitors}\n`
  );
  fs.appendFileSync(
    process.env.GITHUB_ENV,
    `TOTAL_UNIQUE_VISITORS=${history.totalUniqueVisitors}\n`
  );
}
