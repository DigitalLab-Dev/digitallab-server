export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200; // average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};