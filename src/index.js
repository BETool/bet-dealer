'use strict';

class BetDealer {
  addListener () {
    console.log('Listen incoming messages.');
  }

  processMessage (message, id, sendResponse) {
    sendResponse({
      err: false,
      value: 'ok'
    });
  }
}

export default BetDealer;
