const test = require('node:test');
const assert = require('node:assert/strict');
const { settle } = require('./settle.js');
const bill = amounts => amounts.map((amount,i) => ({name:'Guest '+i, amount}));
test('every transfer leaves each payer at their exact share', () => {
  for (const amounts of [['48','12','0'],['0','0','0.01'],['0.01','0.01','0.01'],['3.45','9.02','1.93','0']]) {
    const entries = bill(amounts), result = settle(entries);
    const net = amounts.map(a => Math.round(Number(a)*100));
    for (const {from,to,cents} of result.transfers) {
      net[entries.findIndex(e => e.name === from)] += cents;
      net[entries.findIndex(e => e.name === to)] -= cents;
    }
    assert.deepEqual(net, result.shares);
    assert.ok(Math.max(...net)-Math.min(...net)<=1);
  }
});
test('rejects incomplete names and fractions smaller than a cent', () => {
  assert.throws(() => settle(bill(['0','1.001'])));
  assert.throws(() => settle([{name:'A',amount:'1'}, {name:' a ',amount:'2'}]));
});
