import mockRecords from '@/mock';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getStatistics() {
  await delay();
  const totalSpaces = 6800;
  const usedSpaces = 5647;
  const freeSpaces = totalSpaces - usedSpaces;
  const utilization = ((usedSpaces / totalSpaces) * 100).toFixed(2) + '%';

  return {
    code: 200,
    data: {
      totalSpaces,
      usedSpaces,
      freeSpaces,
      utilization,
      parkingType: [
        { name: '临时停车位', value: 4455 },
        { name: '月卡车位', value: 2724 },
        { name: '放行车位', value: 257 },
        { name: '白名单车位', value: 296 },
        { name: '预留车位', value: 222 },
        { name: '空闲车位', value: 1190 }
      ],
      dailyTraffic: [
        { date: '02-27', entry: 2030, exit: 1540 },
        { date: '02-26', entry: 1890, exit: 1420 },
        { date: '02-25', entry: 2100, exit: 1670 },
        { date: '02-24', entry: 1950, exit: 1580 },
        { date: '02-23', entry: 2200, exit: 1790 },
        { date: '02-22', entry: 2080, exit: 1630 },
        { date: '02-21', entry: 1980, exit: 1500 }
      ],
      paymentTrend: {
        times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00'],
        amounts: [3200, 2800, 1500, 1800, 7500, 10200, 8900, 6700]
      },
      realtimeTrend: {
        times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00'],
        occupied: [1200, 1100, 950, 880, 1450, 1820, 1750, 1680]
      },
      trafficFlow: {
        total: 6445,
        entry: 4305,
        exit: 2140
      }
    }
  };
}

export async function getAccessRecords(params = {}) {
  await delay();
  const { page = 1, pageSize = 10, parkingLot = '', plateNumber = '', startEntryTime, endEntryTime, startExitTime, endExitTime, passType = '' } = params;
  
  const allRecords = mockRecords.generateRecords(100);
  
  let filtered = allRecords.filter(item => {
    if (parkingLot && item.parkingLot !== parkingLot) return false;
    if (plateNumber && !item.plateNumber.includes(plateNumber)) return false;
    if (passType && item.passType !== passType) return false;
    if (startEntryTime && new Date(item.entryTime) < new Date(startEntryTime)) return false;
    if (endEntryTime && new Date(item.entryTime) > new Date(endEntryTime)) return false;
    if (startExitTime && item.exitTime && new Date(item.exitTime) < new Date(startExitTime)) return false;
    if (endExitTime && item.exitTime && new Date(item.exitTime) > new Date(endExitTime)) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);
  
  return {
    code: 200,
    data: {
      list,
      total
    }
  };
}
