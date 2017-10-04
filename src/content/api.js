
export function prepareToAdd() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({}, resolve);
  });
}
