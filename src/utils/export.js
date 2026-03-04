import FileSaver from 'file-saver';

export function exportCSV(data, filename = 'export.csv') {
  if (!data || !data.length) {
    this.$message.warning('无数据可导出');
    return;
  }
  const headers = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(row => 
    Object.values(row).map(value => {
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',')
  ).join('\n');
  
  const csv = headers + rows;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  FileSaver.saveAs(blob, filename);
}
