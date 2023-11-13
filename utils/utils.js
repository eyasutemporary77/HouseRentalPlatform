function extractPublicIDFromUrl(urls) {
  var publicIds = [];
  urls.map((url) => {
    const parts = url.split("/");
    const identifier = parts[parts.length - 1].split(".")[0];
    publicIds.push(identifier);
  });
  return publicIds;
}
module.exports = extractPublicIDFromUrl;
