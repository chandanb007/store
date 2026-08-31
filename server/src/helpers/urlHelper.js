const buildMediaUrl = (path) => {
  if (!path) return null;
  return `${process.env.APP_URL}${path.replace(/\\/g, "/")}`;
}; 

module.exports = {
  buildMediaUrl,
};
