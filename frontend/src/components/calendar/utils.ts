export const getCalendarHeight = (): number => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return 450;
    if (window.innerWidth < 768) return 500;
  }
  return 600;
};