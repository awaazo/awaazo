
/**
 * Use this function when you need to display a duration in a standardized time format
 * Output Example:
 * - convertTime(3661) -> "01:01:01" (1 hour, 1 minute, 1 second)
 * - convertTime(65) -> "01:05" (1 minute, 5 seconds)
 * - convertTime(3600) -> "01:00:00" (1 hour)
 */

export const convertTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const timeParts = [hours, mins, secs]
    .map((v) => (v < 10 ? "0" + v : v.toString()));
  return hours > 0
    ? `${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`
    : `${timeParts[1]}:${timeParts[2]}`;
};

/**
 * This function is useful for displaying durations in a user-friendly way (like the playlist)
 * Output Example:
 * - formatSecToDurationString(3903) -> "1 hr 5 min"
 * - formatSecToDurationString(63) -> "1 min 3 sec"
 * - formatSecToDurationString(3600) -> "1 hr"
 */
export const formatSecToDurationString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let parts = [];
  if (hours > 0) parts.push(`${hours} hr`);
  if (hours > 0 || minutes > 0) parts.push(`${minutes} min`);
  if (hours === 0 && remainingSeconds > 0) parts.push(`${remainingSeconds} sec`);

  return parts.join(' ') || '0 sec';
};

/**
 * A configuration object for a slider component,used in PLayingNow.
 */
export const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows:false,
  cssEase:"ease",
  easing:"linear",
  mobileFirst:"true",
};