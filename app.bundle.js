(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var card = require('./lib/card');
var dealderCards = require('./lib/dealer-cards');
var deckAssets = require('./lib/deck-assets');
var playerCards = require('./lib/player-cards');
},{"./lib/card":2,"./lib/dealer-cards":3,"./lib/deck-assets":4,"./lib/player-cards":5}],2:[function(require,module,exports){
var card = function(options) {
  if (typeof options === 'undefined') {
    throw new Error('Please provide card content');
  }

  var _isEmpty = false;
  var _color = options.color;
  var _number = options.number;
  var _combinedString = options.combinedString;

  function isEmpty() {
    return _isEmpty;
  }

  function clear() {
    _isEmpty = true;
    _color = null;
    _number = null;
    _combinedString = null;
  }

  function getContent() {
    return {
      color: _color,
      number: _number,
      combinedString: _combinedString
    };
  }

  return {
    isEmpty: isEmpty,
    clear, clear,
    getContent: getContent
  };

}

module.exports = card;
},{}],3:[function(require,module,exports){
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
},{"./card":2,"./deck-assets":4}],4:[function(require,module,exports){
function deckAssets() {
  // store the generated cards in order not to repeat them.
  var generatedCards = [];

  var numbers = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 'ace', 'jack', 'king', 'queen'
  ];

  var colors = [
    'clubs', 'diamonds', 'hearts', 'spades'
  ];

  /**
   * Generate random index from 0 to maximum value.
   * @param  {Number} maxValue Maximum value you expect.
   * 
   * @return {Number}
   */
  function generateIndex(maxValue) {
    var index = Math.ceil((Math.random() * maxValue) - 1);
    return index;
  }

  function getRandomCard() {
    var number = numbers[generateIndex(numbers.length)];
    var color = colors[generateIndex(colors.length)];
    var combinedString = number + '_of_' + color;
    var card = {
      number: number,
      color: color,
      combinedString: combinedString
    };

    if (generatedCards.indexOf(combinedString) > -1) {
      return getRandomCard();
    } else {
      generatedCards.push(card.combinedString);
      return card;
    }
  }

  return {
    getRandomCard: getRandomCard
  }
}

module.exports = Object.create(deckAssets());
},{}],5:[function(require,module,exports){
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
},{"./card":2,"./dealer-cards":3}]},{},[1]);
