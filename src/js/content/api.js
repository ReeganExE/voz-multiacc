import browser from 'webextension-polyfill';

import * as types from '../types';

export function prepareToAdd(userName) {
  return browser.runtime.sendMessage({ type: types.PREAPRE_ADD, payload: userName });
}

export function getAllAccounts() {
  return new Promise(resolve => chrome.runtime.sendMessage({ type: types.GET_ACCOUNTS }, resolve));
}

export function changeToAccount({ toAccount, currentUserName }) {
  return browser.runtime.sendMessage({ type: types.CHANGE_ACCOUNTS, payload: { toAccount, currentUserName } });
}
