import gen from './menu-gen';
import { closest } from '../utils';
import * as api from './api';

const SELECTOR_ME = 'strong a[href^="member.php"]';

function appendScript(selector = SELECTOR_ME) {
  var c = `document.querySelector('${selector}').id = 'multiacc'; vbmenu_register('multiacc')`;
  var vs = document.getElementById('vl-script');
  if (vs) {
    document.head.removeChild(vs);
  }
  vs = document.createElement('script');
  vs.id = 'vl-script';
  vs.textContent = c;
  document.head.appendChild(vs);
}

async function html() {
  const h = await gen();
  const menu = Object.assign(document.createElement('div'), { innerHTML: h });
  const me = document.querySelector(SELECTOR_ME);
  const userName = me ? me.textContent.trim() : null;

  menu.querySelector('#multiacc_menu').addEventListener('click', e => {
    e.preventDefault();
    const tr = closest(e.target, 'tr', 'div');

    if (tr.matches('.add-new')) {
      api.prepareToAdd(userName).then(() => location.reload());
    } else {
      const accountId = tr.getAttribute('account');
      api.changeToAccount({ toAccount: accountId, currentUserName: userName }).then(() => location.reload());
    }
  }, false);

  document.querySelector('.vbmenu_popup').parentNode.appendChild(menu);
}

function checkForLoggedIn() {
  const loginBtn = document.querySelector('form[action^="login.php"] input.button');
  if (loginBtn) {
    const swAccount = Object.assign(document.createElement('a'), {href: '#', textContent: 'Switch', id: 'multiacc'});
    loginBtn.parentNode.appendChild(swAccount);
    return '#multiacc';
  }
}

html();
appendScript(checkForLoggedIn());
