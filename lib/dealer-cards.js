var card = require('./card');
var deckAssets = require('./deck-assets');

var dealerCards = function() {
  var cards = [];

  function get() {
    if (cards.length < 3) {
      cards = generate(3);
    }

    return cards;
  }

  function generate(length) {
    if (typeof length === 'undefined') {
      throw new Error('Please provide length for generating a new hand');
    }

    var cardContent = deckAssets.getRandomCard();

    var result = [];
    while (length--) {
      result.push(card(deckAssets.getRandomCard()));
    }

    return result;
  }

  return {
    get: get,
    generate: generate
  }
}

module.exports = dealerCards();