import { getAllAccounts } from './api';

export default function generate() {
  return getAllAccounts().then(template);
}

function template(accounts) {
  accounts = accounts.map(acc => `
    <tr class="change-acc" account="${acc.id}">
      <td class="vbmenu_option vbmenu_option_alink">
        <a href="${acc.id}">${acc.name}</a></td></tr>`)
    .join('\n');

  let html = `
  <div class="vbmenu_popup" id="multiacc_menu" style="display: none; position: absolute; z-index: 50;">
  <table cellpadding="4" cellspacing="1" border="0">
  <tbody>
      <tr><td class="thead">Voz Multi Account</td></tr>
      ${accounts}
      <tr class="add-new"><td class="vbmenu_option vbmenu_option_alink"><a href="#"><em>Add account</em></a></td></tr>
  </tbody></table>
  </div>
  `;

  return html;
}
