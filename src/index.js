'use strict';

class BetDealer {
  constructor (bg) {
    this.bg = bg;
  }

  addListener () {
    console.log('Listen incoming messages.');
  }

  processMessage (message, id, sendResponse) {
    if ('object' !== typeof message) {
      return this.sendError(sendResponse);
    }

    switch (message.type) {
      case 'PING':
        return this.sendPong(sendResponse);
        break;
      case 'GET_MODULES':
        return this.sendModules(sendResponse, message.payload);
        break;
      default:
        return this.sendError(sendResponse);
        break;
    }
  }

  sendPong (sendResponse) {
    this.sendResponse(sendResponse, 'pong');
  }

  sendModules (sendResponse, payload) {
    this.sendResponse(
      sendResponse,
      {
        payload: this.getModulses(payload)
      }
    );
  }

  sendError (sendResponse, errMessage = 'Error') {
    this.sendResponse(sendResponse, errMessage, true);
  }

  sendResponse (sendResponse, message, err = false) {
    sendResponse({
      err: err,
      value: message
    });
  }

  getModulses (payload) {
    const modules = [];
    const config = this.getConfig();

    config.forEach(part => {
      if (
        part.h
        &&
        new RegExp(part.h).test(payload.host)
        &&
        part.l
        &&
        part.l.length
      ) {
        part.l.forEach(l => {
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
