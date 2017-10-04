import gen from './menu-gen';
import { closest } from '../utils';

function appendScript() {
  var c = `document.querySelector('strong a[href^="member.php"]').id = 'multiacc'; vbmenu_register('multiacc')`;
  var vs = document.getElementById('vl-script');
  if (vs) {
    document.head.removeChild(vs);
  }
  vs = document.createElement('script');
  vs.id = 'vl-script';
  vs.textContent = c;
  document.head.appendChild(vs);
}

function html() {
  const h = gen();
  const menu = Object.assign(document.createElement('div'), { innerHTML: h });

  menu.querySelector('#multiacc_menu').addEventListener('click', e => {
    e.preventDefault();
    const tr = closest(e.target, 'tr', 'div');

    if (tr.matches('.add-new')) {
      console.log(tr);
    }
  }, false);

  document.querySelector('.vbmenu_popup').parentNode.appendChild(menu);
}

html();
appendScript();
