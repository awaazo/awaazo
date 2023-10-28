export const convertTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return [mins, secs].map((v) => (v < 10 ? "0" + v : v)).join(":");
};
