
# Voz Multi Accounts
Add ability to log in multiple accounts.

Install on Chrome: https://chrome.google.com/webstore/detail/voz-multi-account/ficeliahbgmgiofbongahjjpkcndobfh

![voz-multi-background](https://user-images.githubusercontent.com/7277418/31332647-5fcd0526-ad11-11e7-8849-07ed12ea2000.png)


## How It Works
It saves some identified cookies into `storage.local` and switches back once users change account.

## Development

### Clone & Run
```sh
git clone git@github.com:ReeganExE/voz-multiacc.git
cd voz-multiacc
yarn # npm install
npm start
```
Goto `chrome://extensions/` with `Developer mode`, click `Load unpacked extension ...`, point to the `dist` directory.

### Build
```sh
npm run build
```

## LICENSE
Copyright (c) Ninh Pham (ReeganExE). All rights reserved.

Licensed under the MIT License.