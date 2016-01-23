(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var card = require('./lib/card');
var dealerCards = require('./lib/dealer-cards');
var deckAssets = require('./lib/deck-assets');
var playerCards = require('./lib/player-cards');

var Dom = {
  update: function() {
    // Dom.updateDeck();
    Dom.drawTable();
    Dom.updateDealerCards();
    Dom.updatePlayerCards();
  },

  createSlots: function(index, storage) {
    var content = storage.cards[index].getContent().combinedString;
    var $element = $('<div class="card" data-index="' + index + '"></div>');
    storage.$container.append($element);
  },

  createCard: function(index, storage) {
    var content = storage.cards[index].getContent().combinedString;    
    // find its container by index.
    var $container = $(storage.$container.find('.card')[index]);

    console.log($container);

    var $img = $('<img src="./img/' + content + '.png" alt="' + content + '" data-index="' + index + '"/>');

    var left = Dom.getDeckPosition().left - $container.offset().left;
    var top = Dom.getDeckPosition().top - $container.offset().top;

    $img.css('top', top);
    $img.css('left', left);

    $container.append($img);

    setTimeout(function() {
      $img.addClass('in-placeholder-position');
    }, 100);

    if (++index < storage.cards.length) {
      setTimeout(function() {
        Dom.createCard(index, storage);
      }, 1000);
    }
  },

  createDeck: function() {
    var numberOfCards = 6;
    var index = 1;
    var $container = $('.deck');

    while(index <= numberOfCards) {
      var $element = $('<div class="card-back"></div>');
      $element.css('top', index * 2);
      $element.css('left', index * 2);
      $container.append($element);

      index++;
    }
  },

  getDeckPosition: function() {
    return {
      top: parseInt($('.deck').offset().top),
      left: parseInt($('.deck').offset().left)
    };
  },

  drawTable: function() {
    Game.dealerCards.cards.forEach(function(value, index) {
      Dom.createSlots(index, Game.dealerCards);
    });

    Game.playerCards.cards.forEach(function(value, index) {
      Dom.createSlots(index, Game.playerCards);
    });
  },

  updateDealerCards: function() {
    Dom.createCard(0, Game.dealerCards);
  },

  updatePlayerCards: function() {
    setTimeout(function() {
      Dom.createCard(0, Game.playerCards);
    }, 3000);
  },

  removeCard: function($card) {
    $card.addClass('remove-add');

    setTimeout(function() {
      $card.addClass('remove-add-active');

      setTimeout(function() {
        $card.find('img').remove();
        
        $card
          .removeClass('remove-add')
          .removeClass('remove-add-active');        

      }, 1000);

    }, 100);
  },

  cleanPlayerCards: function() {
    Game.playerCards.$container.find('.card').each(function() {
      Dom.removeCard($(this));
    });
  },

  initListeners: function() {
    $('.player-cards .card').click(function() {
      Dom.removeCard($(this));
      playerCards.pick($(this).data('index'));
    });
  }
}

var Game = {
  playerCards: {
    $container: $('.player-cards'),
    cards: playerCards.get()
  },

  dealerCards: {
    $container: $('.dealer-cards'),
    cards: dealerCards.get()
  },

  getFreshHand: function() {
    playerCards.refresh();
    Dom.cleanPlayerCards();

    setTimeout(function() {
      Dom.createCard(0, Game.playerCards);
    }, 2000);
  },

  init: function() {
    Dom.update();
    Dom.createDeck();
    Dom.initListeners();
  }
};

window.refresh = Game.getFreshHand;

Game.init();
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
    'clubs',
    'diamonds',
    'hearts',
    'spades'
  ];

  var cardsWithImages = [
    'jack',
    'king',
    'queen'
  ];

  function isCardWithImage(number) {
    return cardsWithImages.indexOf(number) > -1;
  }

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

    if (isCardWithImage(number)) {
      combinedString += '2';
    }

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
