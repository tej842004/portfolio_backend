const {
  extractPlainTextFromTipTapJSON,
} = require("./extractPlainTextFromTipTapJSON");

const calculateReadTime = (content) => {
  let readTime = 1;
  try {
    const plainText = extractPlainTextFromTipTapJSON(content);
    const wordsPerMinute = 200;
    const wordCount = plainText.trim().split(/\s+/).length;
    readTime = Math.ceil(wordCount / wordsPerMinute);
  } catch (err) {
    console.warn("Could not calculate read time:", err);
  }
  return readTime;
};

exports.calculateReadTime = calculateReadTime;
