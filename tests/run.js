var assert = require('assert')
  , gengo = require('../lib/gengo');

var m = gengo.init({
    publicKey: 'Sj-Hv~c2hqv-^55A5bbnke5E0TH5pmHZD2nCX]ZVhjeh9($)_cXwUlXHXBb{hO2='
  , privateKey: ']782GSguFezlIM]=M6@PuJtBGDl[HOAW6a]TzVtEQ4NiAyR1IJVfub@bok^cym]6'
  , sandbox: true
});

m.getAccountStats(function(json) {
  assert.equal(json.opstat, 'ok', 'getAccountStats() completed successfully');
});
m.getAccountBalance(function(json) {
  assert.equal(json.opstat, 'ok', 'getAccountBalance() completed successfully');
});
m.getAccountBalance(function(json) {
  assert.equal(json.opstat, 'ok', 'getAccountBalance() completed successfully');
});