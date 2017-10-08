import browser from 'webextension-polyfill';

import * as types from '../types';

export function newSession(userName) {
  return browser.runtime.sendMessage({ type: types.PREAPRE_ADD, payload: userName });
}

export function getAllAccounts() {
  // TODO: Unable to use browser.runtime.sendMessage right now
  // https://github.com/mozilla/webextension-polyfill/issues/58
  return new Promise(resolve => chrome.runtime.sendMessage({ type: types.GET_ACCOUNTS }, resolve));
}

export function changeToAccount({ toAccount, currentUserName }) {
  return browser.runtime.sendMessage({ type: types.CHANGE_ACCOUNTS, payload: { toAccount, currentUserName } });
}
