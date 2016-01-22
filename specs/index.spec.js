var expect = require('chai').expect;
var dealerCards = require('../lib/dealer-cards');
var playerCards = require('../lib/player-cards');
var deckAssets = require('../lib/deck-assets');

describe('Game', function() {

  describe('Deck assets', function() {
    it('should generate card with color, number and combinedString', function() {
      var card = deckAssets.getRandomCard();
      expect(card.color).to.be.ok;
      expect(card.number).to.be.ok;
      expect(card.combinedString).to.equal(card.number + '_of_' + card.color);
    });
  });

  describe('Dealer cards', function() {
    
    it('should always be 3 cards', function() {
      var cards = dealerCards.get();
      expect(cards.length).to.equal(3);
    });

    it('should have content', function() {
      var cards = dealerCards.get();
      function assert(index) {
        expect(cards[index].isEmpty()).not.to.be.ok;

        if (++index < 3) {
          assert(index);
        }
      }

      assert(0);
    });

    it('should generate a new hand', function() {
      var freshHand = dealerCards.generate(2);
      expect(freshHand.length).to.equal(2);
    });

  });

  describe('Player cards', function() {

    it('should remove a card by index', function() {
      var cards = playerCards.get();
      expect(cards[1].isEmpty()).not.to.be.ok;
      playerCards.pick(1);
      expect(cards[1].isEmpty()).to.be.ok;
    });

    it('should refresh the hand', function() {
      var cards = playerCards.get();
      var freshHand = playerCards.refresh();
      function compare(index) {
        expect(freshHand[index].getContent().color).not.to.equal(cards[index].getContent().color);
        expect(freshHand[index].getContent().number).not.to.equal(cards[index].getContent().number);

        if (++index < cards.length) {
          compare(index);
        }
      }

      compare(0);
    });
  });
});