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