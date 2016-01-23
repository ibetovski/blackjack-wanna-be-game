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