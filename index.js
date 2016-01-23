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
    var content = storage.getCards()[index].getContent().combinedString;
    var $element = $('<div class="card" data-index="' + index + '"></div>');
    storage.$container.append($element);
  },

  createCard: function(index, storage) {
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
    }, 100);

    if (++index < storage.getCards().length) {
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
    Game.dealerCards.getCards().forEach(function(value, index) {
      Dom.createSlots(index, Game.dealerCards);
    });

    Game.playerCards.getCards().forEach(function(value, index) {
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

    }, 300);
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

    $('.hit-button').click(function() {
      Game.getFreshHand();
    });
  }
}

var Game = {
  playerCards: {
    $container: $('.player-cards'),
    getCards: function() {
      return playerCards.get();
    }
  },

  dealerCards: {
    $container: $('.dealer-cards'),
    getCards: function() {
      return dealerCards.get();
    }
  },

  getFreshHand: function() {
    if (Game.isEventInProgress) {
      return;
    }

    Game.isEventInProgress = true;
    playerCards.refresh();
    Dom.cleanPlayerCards();

    setTimeout(function() {
      Dom.createCard(0, Game.playerCards);
      Game.isEventInProgress = false;
    }, 2000);
  },

  init: function() {
    Dom.update();
    Dom.createDeck();
    Dom.initListeners();
  }
};

Game.init();