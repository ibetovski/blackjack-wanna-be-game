var card = require('./card');
var dealerCards = require('./dealer-cards');

function playerCards() {
  var cards = dealerCards.generate(2);

  function pick(index) {
    cards[index].clear();
    return cards;
  }

  function get() {
    return cards;
  }

  function refresh() {
    cards = dealerCards.generate(2);
    return cards;
  }

  return {
    get: get,
    pick: pick,
    refresh: refresh
  }
}

module.exports = playerCards();