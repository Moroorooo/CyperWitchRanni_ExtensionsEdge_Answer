chrome.contextMenus.create({
  id: "answerQuestion",
  title: "XinChao_CyperWitchRanni",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "answerQuestion") {
    chrome.action.openPopup();
  }
});