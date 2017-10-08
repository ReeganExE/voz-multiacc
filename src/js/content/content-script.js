import gen from './menu-gen';
import { closest } from '../utils';
import * as api from './api';

const SELECTOR_ME = 'strong a[href^="member.php"]';
const reload = () => location.reload();

/**
 * Execute `vbmenu_register` to register Switch menu.
 * @param {String} selector
 */
function registerMenu(selector = SELECTOR_ME) {
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

/**
 * Generate Account menu items and handle click event.
 */
async function generateAccountsMenu() {
  const h = await gen();
  const menu = Object.assign(document.createElement('div'), { innerHTML: h });
  const me = document.querySelector(SELECTOR_ME);
  const userName = me ? me.textContent.trim() : null;

  menu.querySelector('#multiacc_menu').addEventListener('click', e => {
    e.preventDefault();
    const tr = closest(e.target, 'tr', 'div');

    if (tr.matches('.add-new')) {
      // Save current session and create new one
      api.newSession(userName).then(reload);
    } else {
      // Switch account
      const accountId = tr.getAttribute('account');
      api.changeToAccount({ toAccount: accountId, currentUserName: userName }).then(reload);
    }
  }, false);

  document.querySelector('.vbmenu_popup').parentNode.appendChild(menu);
}

/**
 * Checks for user is logged in.
 * And creates a Switch button.
 */
function checkForLoggedIn() {
  const loginBtn = document.querySelector('form[action^="login.php"] input.button');

  if (loginBtn) { // Have login button
    const swAccount = Object.assign(document.createElement('a'), {href: '#', textContent: 'Switch', id: 'multiacc'});
    loginBtn.parentNode.appendChild(swAccount);
    return '#multiacc';
  }
}

generateAccountsMenu();
registerMenu(checkForLoggedIn());
