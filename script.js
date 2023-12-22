document.addEventListener('DOMContentLoaded', function () {
  const randomWordElement = document.getElementById('random-word');
  let usedWords = [];
  let currentTabId;

  randomWordElement.addEventListener('click', function () {
    const numberOfSearches = prompt('Enter the number of searches:');
    if (numberOfSearches && !isNaN(numberOfSearches)) {
      performAutomaticSearches(parseInt(numberOfSearches, 10));
    }
  });

  function performAutomaticSearches(numberOfSearches) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        currentTabId = tabs[0].id;
        recursiveSearch(numberOfSearches);
      }
    });
  }

  function recursiveSearch(remainingSearches) {
    if (remainingSearches > 0) {
      generateRandomWord(function (randomWord) {
        if (randomWord) {
          usedWords.push(randomWord);
          searchGoogle(randomWord, function () {
            recursiveSearch(remainingSearches - 1);
          });
        } else {
          usedWords = [];
          alert('All words have been used. Resetting the list.');
        }
      });
    }
  }

  function generateRandomWord(callback) {
    const meaningfulCombinations = ['sky', 'down', 'science', 'random', 'coding', 'javascript', 'gpt', 'extension', 'meaningful'];
    const availableWords = meaningfulCombinations.filter(word => !usedWords.includes(word));

    if (availableWords.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    callback(availableWords[randomIndex]);
  }

  function searchGoogle(query, callback) {
    chrome.tabs.update(currentTabId, { url: `https://www.google.com/search?q=${encodeURIComponent(query)}` }, function () {
      setTimeout(callback, 2000);
    });
  }
});
