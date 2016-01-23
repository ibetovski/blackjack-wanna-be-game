(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var card = require('./lib/card');
var dealerCards = require('./lib/dealer-cards');
var deckAssets = require('./lib/deck-assets');
var playerCards = require('./lib/player-cards');
var dom = require('./lib/dom-manipolator');
var Game = require('./lib/game');

// Start everything.
// $(document).ready(function() {
//   $('button.start').click(function() {
    Game.init();
//   });
// });
},{"./lib/card":2,"./lib/dealer-cards":3,"./lib/deck-assets":4,"./lib/dom-manipolator":5,"./lib/game":6,"./lib/player-cards":7}],2:[function(require,module,exports){
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
var dealerCards = require('./dealer-cards');
var playerCards = require('./player-cards');

var Game;

/**
 * Interface for DOM manipulations
 * 
 * @type {Object}
 */
var Dom = {
  /**
   * Creates the div containers for every card and places it in the Dom.
   * 
   * @param  {Number} index   Number of the slot to be created
   * @param  {Object} $container Element to append to.
   *                           
   * @return {[type]}         [description]
   */
  createSlots: function(index, $container) {
    $container.append($('<div class="card" data-index="' + index + '"></div>'));
  },

  /**
   * Creates a new image tag, gets the deck's positions, place the image on top
   *  of the deck and slides it into its slot position.
   *
   * The function is recursive promise which will resolve when all the cards are created.
   *
   * @todo: Use transisionEnd to know when the image is on its position.
   * 
   * @param  {Number} index   always start with 0
   * @param  {Object} storage Pass the dealer or player storage object from Game.
   *                           It is used to know inside which container to render.
   *                           
   * @return {Object}         Promise
   */
  createCard: function(index, storage) {
    var promise = $.Deferred();
    var content = storage.getCards()[index].getContent().combinedString;    
    // find its container by index.
    var $container = $(storage.$container.find('.card')[index]);

    var $img = $('<img src="./img/' + content + '.png" alt="' + content + '" data-index="' + index + '"/>');


    var left = Dom.getDeckPosition().left - $container.offset().left;
    var top = Dom.getDeckPosition().top - $container.offset().top;

    $img.css('top', top);
    $img.css('left', left);

    $container.append($img);

    setTimeout(function() {
      $img.addClass('in-placeholder-position');

      if (++index < storage.getCards().length) {
        return setTimeout(function() {
          return Dom
              .createCard(index, storage)
              .then(function() {
                return promise.resolve();
              });
        }, 1000);
      } else {
        return promise.resolve();
      }
    }, 100);

    return promise;
  },

  /**
   * Creates an illusion for deck of cards
   */
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

  /**
   * Remove card and return a promise to resolve when the card is removed.
   * @param  {Object} $card jQuery object of the card container, not the img object.
   * @return {Object}       Promise
   */
  removeCard: function($card) {
    var promise = $.Deferred();
    $card.addClass('remove-add');

    setTimeout(function() {
      $card.addClass('remove-add-active');

      setTimeout(function() {
        $card.find('img').remove();

        $card
          .removeClass('remove-add')
          .removeClass('remove-add-active');

          promise.resolve();

      }, 1000);

    }, 300);

    return promise;
  },

  /**
   * Will clean player's cards. If no cards exist, will resolve at the moment.
   * 
   * @return {Object} Promise which will resolve when all cards are removed.
   */
  cleanPlayerCards: function() {
    var promise = $.Deferred();
    var numberOfExistingCards = Game.player.$container.find('img').length;
    var items = Game.player.$container.find('.card');
    if (numberOfExistingCards > 0) {
      items.each(function(index) {
        Dom.removeCard($(this)).then(function() {
          if (index >= items.length - 1) {
            promise.resolve();
          }
        });
      });
    } else {
      promise.resolve();
    }

    return promise;
  },

  /**
   * Exposes Game to the current scope.
   * @param  {Object} _Game The Game object
   */
  init: function(_Game) {
    Game = _Game;
  },

  /**
   * Adds event listeners to manipulate the game from the Dom.
   */
  initListeners: function() {
    $('.player-cards .card').click(function() {
      Dom.removeCard($(this));
      playerCards.pick($(this).data('index'));
    });

    $('.hit-button').click(function() {
      Game.getFreshHand();
    });
  }
}

module.exports = Dom;
},{"./dealer-cards":3,"./player-cards":7}],6:[function(require,module,exports){
var dealerCards = require('./dealer-cards');
var playerCards = require('./player-cards');
var Dom = require('./dom-manipolator');

var Game = {
  /**
   * Easy access to the player's container and cards.
   * @type {Object}
   */
  player: {
    $container: $('.player-cards'),
    getCards: function() {
      return playerCards.get();
    }
  },

  /**
   * Easy access to the dealer's container and cards.
   * @type {Object}
   */
  dealer: {
    $container: $('.dealer-cards'),
    getCards: function() {
      return dealerCards.get();
    }
  },

  /**
   * Draw all placeholders for the player or the dealer.
   * 
   * @param  {String} role Pass as a string the property of Game's dealer or player.
   * @return {Object}      Promise
   */
  drawTable: function(role) {
    var promise = $.Deferred();
    var cards = Game[role].getCards();
    var length = cards.length;

    cards.forEach(function(value, index) {
      Dom.createSlots(index, Game[role].$container);

      if (index >= length - 1) {
        return promise.resolve();
      }
    });

    return promise;
  },

  /**
   * Animated cards dealing per role (dealer or player).
   * 
   * @param  {String} role 
   * @return {Object} Promise
   */
  dealCards: function(role) {
    return Dom.createCard(0, Game[role]);
  },

  /**
   * Place the deck on the table.
   */
  openDeck: function() {
    Dom.createDeck();
  },

  /**
   * Remove player's cards and replaces them with new hand
   */
  getFreshHand: function() {
    if (Game.isEventInProgress) {
      return;
    }

    Game.isEventInProgress = true;
    playerCards.refresh();
    
    Dom.cleanPlayerCards().then(function() {
      Dom.createCard(0, Game.player);
      Game.isEventInProgress = false;
    });

  },

  /**
   * Start everything with promises.
   */
  init: function() {
    // Initialze the game components.
    Game.drawTable('dealer').then(function() {
      return Game.drawTable('player');
    }).then(function() {
      return Game.openDeck();
    }).then(function() {
      return Game.dealCards('dealer');
    }).then(function() {
      return Game.dealCards('player');
    }).then(function() {
      Dom.init(Game);
      Dom.initListeners();
    });

  }
};

module.exports = Game;
},{"./dealer-cards":3,"./dom-manipolator":5,"./player-cards":7}],7:[function(require,module,exports){
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
