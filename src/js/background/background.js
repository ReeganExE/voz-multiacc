import browser from 'webextension-polyfill';
import _ from 'lodash';

import * as types from '../types';
import * as accounts from './accounts';

const url = 'https://vozforums.com';

window.browser = browser;

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

async function changeAccount({ payload }) {
  const { toAccount, currentUserName } = payload;
  const account = await accounts.getById(toAccount);

  if (!account) {
    return;
  }

  await saveUser(currentUserName);

  const { session } = account;
  session.forEach(cookie => browser.cookies.set(Object.assign({url}, cookie)));
}

/**
 *
 * @param {String} name
 */
function saveUser(name) {
  return browser.cookies.getAll({}).then(cookies => {
    let session = cookies.filter(a => a.httpOnly);

    // Omit some properties
    session = session.map(cookie => _.omit(cookie, ['hostOnly', 'session']));
    const vfuserid = _.find(session, { name: 'vfuserid' });
    const vfsessionhash = _.find(session, { name: 'vfsessionhash' });

    // Do Remove cookies
    session.forEach(c => browser.cookies.remove({ name: c.name, url }));

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

// chrome.cookies.onChanged.addListener(info => {
//   const {cause, cookie, removed} = info;
//   if (cookie.name === 'vfsessionhash') {
//     console.log(info);
//   }
// });
