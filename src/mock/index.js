import Mock from 'mockjs';

// 生成深圳车牌 (粤B + 5位数字/字母)
function generatePlate() {
  const prefix = '粤B';
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + suffix;
}

// 生成随机日期时间字符串 (格式: YYYY-MM-DD HH:mm:ss)
function randomDate(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const timestamp = startTime + Math.random() * (endTime - startTime);
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// 生成单条出入记录
function generateRecord(id) {
  const parkingLots = ['南停车场', '北停车场', '地下B1', '地面停车场', '专属车位'];
  const passTypes = ['临时车', '月卡车', '白名单', 'VIP', '异常'];
  
  // 入场时间范围：最近一周
  const now = new Date();
  const endDate = now.toISOString().slice(0, 10) + ' 23:59:59';
  const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 00:00:00';
  
  const entryTime = randomDate(startDate, endDate);
  
  const hasExit = Mock.Random.boolean(0.7);
  let exitTime = null;
  if (hasExit) {
    // 出场时间在入场后 1 小时内到 2 天内
    const entryTimestamp = new Date(entryTime).getTime();
    const maxExit = entryTimestamp + 2 * 24 * 60 * 60 * 1000;
    const exitTimestamp = entryTimestamp + Math.random() * (maxExit - entryTimestamp);
    exitTime = new Date(exitTimestamp).toISOString().slice(0, 19).replace('T', ' ');
  }
  
  return {
    id,
    plateNumber: generatePlate(),
    parkingLot: Mock.Random.pick(parkingLots),
    entryTime,
    exitTime,
    passType: Mock.Random.pick(passTypes),
    entryImage: 'https://via.placeholder.com/150?text=入场',
    exitImage: hasExit ? 'https://via.placeholder.com/150?text=出场' : null,
    duration: exitTime ? Math.floor((new Date(exitTime) - new Date(entryTime)) / 60000) : null
  };
}

export default {
  generateRecords(count = 100) {
    const records = [];
    for (let i = 0; i < count; i++) {
      records.push(generateRecord(i + 1));
    }
    return records;
  }
};