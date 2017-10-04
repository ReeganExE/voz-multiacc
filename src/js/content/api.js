
import * as types from '../types';

export function prepareToAdd() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: types.PREAPRE_ADD }, resolve);
  });
}
