'use strict';

class BetDealer {
  addListener () {
    console.log('Listen incoming messages.');
  }

  sendAnswer (message, id, sendResponse) {
    sendResponse({
      err: false,
      value: 'ok'
    });
  }
}

export default BetDealer;
