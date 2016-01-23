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