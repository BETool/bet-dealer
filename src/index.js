'use strict';

import Logger from 'bet-logger';
import { iframeResolver, hostResolver } from './resolvers';

const log = new Logger('BET:dealer');

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
      log('message', message);
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
    return Promise.resolve()
      .then(() => this.getModules(payload))
      .then(payload => this.sendResponse(sendResponse, { payload }))
      .catch(err => this.sendResponse(sendResponse, err));
  }

  sendError (sendResponse, errMessage = 'Error') {
    this.sendResponse(sendResponse, errMessage, true);
  }

  sendResponse (sendResponse, value, err = false) {
    sendResponse({ err, value });
  }

  getModules (payload) {
    return Promise.resolve()
      .then(() => this.bg.getConfig())
      .then((config) => {
        const modules = [];

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
                  l, // link to inject file
                  i: ('number' === typeof part.i) ? part.i : 0, // mount as (txt-0|eval-1|api-2|link-3)
                  r: ('number' === typeof part.r) ? part.r : 0, // start at (dom-0|now-1|rnd-(start|end)|delay-xx)
                  c: this.bg.cache.modules.get(l), // code txt
                });
              }
            });
          }
        });

        return Promise.resolve(modules);
      });
  }
}

export default BetDealer;
