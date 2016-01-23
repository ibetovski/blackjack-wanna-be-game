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