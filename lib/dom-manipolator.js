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