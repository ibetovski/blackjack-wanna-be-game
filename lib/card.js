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