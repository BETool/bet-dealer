'use strict';

class BetDealer {
  constructor (bg) {
    this.bg = bg;
    this.listeners = 0;
  }

  addListener () {
    this.listeners += 1;
    console.log('Listen incoming messages.');
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
        part.h
        &&
        new RegExp(part.h).test(payload.host)
        &&
        part.l
        &&
        part.l.length
      ) {
        part.l.forEach((l) => {
          modules.push(this.bg.cache.modules.get(l));
        });
      }
    });

    return modules;
  }

  getConfig () {
    // if (this.bg.cache.config.has('config')) {
    //   throw new Error('No config');
    // }
    return this.bg.cache.config.get('config');
  }
}

export default BetDealer;
