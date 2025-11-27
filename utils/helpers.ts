export const cx = (...classes: Array<string | boolean | undefined>) => 
  classes.filter(Boolean).join(' ');

export const formatThaiDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  const buddhistYear = parseInt(year) + 543;
  return `${day}/${month}/${buddhistYear}`;
};

export const formatThaiDateFull = (dateStr: string): string => {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const [year, month, day] = dateStr.split('-');
  const buddhistYear = parseInt(year) + 543;
  return `${parseInt(day)} ${thaiMonths[parseInt(month) - 1]} ${buddhistYear}`;
};