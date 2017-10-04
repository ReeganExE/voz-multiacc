import _ from 'lodash';
import * as types from '../types';
window._ = _;

const url = 'https://vozforums.com';

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === types.PREAPRE_ADD) {
    chrome.cookies.getAll({}, all => {
      let session = all.filter(a => a.httpOnly);
      session.forEach(cookie => _.omit(cookie, ['hostOnly', 'session']));
      const vfuserid = _.find(session, { name: 'vfuserid' });
      if (vfuserid) {
        localStorage['hihi_' + vfuserid.value] = JSON.stringify(session);
      }
      session.forEach(c => chrome.cookies.remove({ name: c.name, url }));
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
