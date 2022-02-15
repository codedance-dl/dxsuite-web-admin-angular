/* eslint-disable */
/**
 * 浏览器识别类
 */

'use strict';

interface BrowserMetadata {
  subString: string;
  identity: string;
  versionSearch?: string
}

interface OSMetadata {
  subString: string;
  identity: string;
}

const BROWSER_DATAS: BrowserMetadata[] = [
  { subString: "Edge", identity: "Edge", versionSearch: "Edge" },
  { subString: 'Opera', identity: "Opera", versionSearch: "Version" },
  { subString: "OPR", identity: "Opera", versionSearch: "OPR" },
  { subString: "Chrome", identity: "Chrome" },
  { subString: "MSIE", identity: "IE", versionSearch: "MSIE" },
  // IE 11 识别
  { subString: "Trident", identity: "IE", versionSearch: "rv" },
  { subString: "Apple", identity: "Safari", versionSearch: "Version" },
  { subString: "Firefox", identity: "Firefox" },
  { subString: "Gecko", identity: "Mozilla", versionSearch: "rv" },
  { subString: "Netscape", identity: "Netscape" },
  { subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla" },
  { subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb" },
  { subString: "Camino", identity: "Camino" },
  { subString: "KDE", identity: "Konqueror" },
  { subString: "iCab", identity: "iCab" }
];

const OS_BROWSER : OSMetadata[]=  [
  { subString: "Win", identity: "Windows" },
  // { subString: "MicroMessenger", identity: "WeChat" },
  { subString: "iPhone", identity: "iPhone" },
  { subString: "iPad", identity: "iPad" },
  { subString: "Macintosh", identity: "Mac" },
  { subString: "Linux", identity: "Linux" },
  { subString: "Android", identity: "Android" }
];

const searchString = (data: any[], dataString: string) => {
  for (let item of data) {
    const versionSearchString = item.versionSearch || item.identity;
    if (dataString) {
      if (dataString.indexOf(item.subString) !== -1) {
        return { identity: item.identity, versionString: versionSearchString };
      }
    }
  }
}

const searchVersion =  (userAgent: string, versionSearchString: string) => {
  const index = userAgent.indexOf(versionSearchString);
  if (index === -1) { return; }
  return parseFloat(userAgent.substring(index + versionSearchString.length + 1));
}

export function searchDeviceInfo(userAgent: string) {
  const { identity, versionString  } = searchString(BROWSER_DATAS, userAgent) || { identity: "an unknown browser", versionString: '' };
  const version = searchVersion(userAgent, versionString) || "";
  const OS = searchString(OS_BROWSER, userAgent) || { identity: "an unknown OS" };
  return {
    browser: identity,
    version,
    platform: `${OS.identity}`
  }
}
