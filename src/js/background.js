import _ from 'lodash';
import * as types from './types';
window._ = _;

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === types.PREAPRE_ADD) {
    chrome.cookies.getAll({}, all => {
      let session = all.filter(a => a.httpOnly);
      session = _.omit(session, ['hostOnly', 'session']);
      const vfuserid = _.find(session, { name: 'vfuserid' });
      if (vfuserid) {
      }
      respond();
    });
    return true;
  }
});

chrome.cookies.onChanged.addListener(info => {
  const {cause, cookie, removed} = info;
  if (cookie.name === 'vfsessionhash') {
    console.log(info);
  }
});
