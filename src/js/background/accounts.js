import browser from 'webextension-polyfill';
import _ from 'lodash';

export function getAll() {
  return browser.storage.local.get({ accounts: [] }).then(r => r.accounts);
}

export async function getById(userId) {
  const accounts = await getAll();
  return _.find(accounts, { id: userId });
}

export async function save(user) {
  const accounts = await getAll();
  const existingUser = _.find(accounts, { id: user.id });
  if (existingUser) {
    Object.assign(existingUser, user);
  } else {
    accounts.push(user);
  }

  return browser.storage.local.set({ accounts });
}
