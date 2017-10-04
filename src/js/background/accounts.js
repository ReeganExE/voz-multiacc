export function getAll() {
  const items = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith('hihi_')) {
      items.push(JSON.parse(localStorage.getItem(key)));
    }
  }

  return items;
}
