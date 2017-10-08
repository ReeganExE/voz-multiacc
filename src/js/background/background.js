import browser from 'webextension-polyfill';
import _ from 'lodash';

import * as types from '../types';
import * as accounts from './accounts';

const url = 'https://vozforums.com';

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === types.PREAPRE_ADD) {
    const name = msg.payload;
    saveUser(name).then(respond).catch(respond);
    return true;
  } else if (msg.type === types.GET_ACCOUNTS) {
    accounts.getAll().then(respond);
    return true;
  } else if (msg.type === types.CHANGE_ACCOUNTS) {
    changeAccount(msg).then(respond);
    return true;
  }
});

chrome.cookies.onChanged.addListener(async info => {
  const {cause, cookie, removed} = info;
  // vfsessionhash expired_overwrite removed
  if (cookie.name === 'vfsessionhash' && removed && cause === 'expired_overwrite') {
    // user logs out
    accounts.removeByHash(cookie.value);
  }

  if (cookie.name === 'vfsessionhash' && cause === 'explicit') { // New session
    const vfuserid = await browser.cookies.get({ url, name: 'vfuserid' });

    if (vfuserid) { // User has just logged in
      const userName = await fetchUserName(vfuserid.value);
      saveUser(userName, false); // Save without removing the current user
    }
  }
});

/**
 * Save or update current session then switch to the new selected one.
 * @param {Object} message Request message from content script
 */
async function changeAccount({ payload }) {
  const { toAccount, currentUserName } = payload;
  const account = await accounts.getById(toAccount);

  if (!account) {
    return;
  }

  await saveUser(currentUserName); // Stash current user

  // Flush new selection user to the cookie
  const { session } = account;
  session.forEach(cookie => browser.cookies.set(Object.assign({url}, cookie)));
}

/**
 * Save current cookies to storage.
 *
 * @param {String} name User's name
 * @param {Boolean} remove Remove current cookie
 */
function saveUser(name, remove = true) {
  return browser.cookies.getAll({}).then(cookies => {
    let session = cookies.filter(a => a.httpOnly);

    // Omit some properties
    session = session.map(cookie => _.omit(cookie, ['hostOnly', 'session']));
    const vfuserid = _.find(session, { name: 'vfuserid' });
    const vfsessionhash = _.find(session, { name: 'vfsessionhash' });

    // Do Remove cookies
    remove && session.forEach(c => browser.cookies.remove({ name: c.name, url }));

    if (vfuserid) {
      return accounts.save({
        id: vfuserid.value,
        name,
        hash: vfsessionhash.value,
        session
      });
    }
  });
}

function fetchUserName(userId) {
  return fetch('https://vozforums.com/member.php?u=' + userId)
    .then(a => a.text())
    .then(html => new DOMParser().parseFromString(html, 'text/html'))
    .then(doc => doc.querySelector('#main_userinfo h1').textContent.trim());
}
