const extractPlainTextFromTipTapJSON = (content) => {
  let text = "";

  function traverse(node) {
    if (node.type === "text") {
      text += node.text + " ";
    }
    if (node.content) {
      node.content.forEach(traverse);
    }
  }

  traverse(content);
  return text;
};

exports.extractPlainTextFromTipTapJSON = extractPlainTextFromTipTapJSON;
