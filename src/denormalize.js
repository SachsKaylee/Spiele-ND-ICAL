const { query, queryAll, text, cdata } = require("./xml");

module.exports.denormalize = function denormalize(xml) {
  const rss = query(xml, e => e.name === "rss");
  return rss.elements.map(channel => {
    const channelName = text(query(channel, e => e.name === "title"));
    const channelDescription = cdata(query(channel, e => e.name === "description"));
    const channelLink = text(query(channel, e => e.name === "link"));
    const channelLastBuildDate = text(query(channel, e => e.name === "lastBuildDate"));
    const channelGenerator = text(query(channel, e => e.name === "generator"));
    const channelLanguage = text(query(channel, e => e.name === "language"));
    const channelItems = queryAll(channel, e => e.name === "item");
    const items = channelItems.map(item => {
      const title = text(query(item, e => e.name === "title"));
      const link = text(query(item, e => e.name === "link"));
      const guid = text(query(item, e => e.name === "guid"));
      const description = cdata(query(item, e => e.name === "description"));
      const category = text(query(item, e => e.name === "category"));
      const pubDate = text(query(item, e => e.name === "pubDate"));
      return {
        title,
        link,
        guid,
        description,
        category,
        pubDate: new Date(pubDate),
      };
    });
    return {
      name: channelName,
      description: channelDescription,
      link: channelLink,
      lastBuildDate: channelLastBuildDate,
      generator: channelGenerator,
      language: channelLanguage,
      items,
    };
  });
}
