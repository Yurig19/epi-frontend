import dayjs from 'dayjs';

export function formatDateWithHour(date: Date): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
}

export function formatDate(date: Date): string {
  return dayjs(date).format('DD/MM/YYYY');
}
