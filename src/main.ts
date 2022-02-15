/* eslint-disable @typescript-eslint/no-explicit-any */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Internet Explorer/Edge 6-10
const isIE = document.all && document.compatMode;

// Internet Explorer/Edge ≥ 10
// eslint-disable-next-line no-extra-parens
const isIE10gt = (document.body.style as any).msTouchAction !== undefined;

// Weixin Browser
const agent = navigator.userAgent.toLowerCase();
const isWeixinBrowser = agent.match(/MicroMessenger/i) && agent.match(/MicroMessenger/i)[0] === "micromessenger";

if (!isIE && !isIE10gt && !isWeixinBrowser) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
} else {
  document.getElementById("no-support-browser").classList.add("visible");
}


