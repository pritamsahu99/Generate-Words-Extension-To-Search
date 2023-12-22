
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
          // All words have been used, reset the list
          usedWords = [];
          alert('All words have been used. Resetting the list.');
        }
      });
    }
  }

  function generateRandomWord(callback) {
    const randomWord = getRandomWord();

    if (randomWord) {
      callback(randomWord);
    } else {
      // All words have been used, reset the list
      usedWords = [];
      alert('All words have been used. Resetting the list.');
    }
  }

  function getRandomWord() {
    // const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const meaningfulCombinations = [
      'sky', 'down', 'science', 'random', 'coding', 'javascript', 'gpt', 'extension', 'meaningful'
      // Add more meaningful combinations as needed
    ];
    const availableWords = meaningfulCombinations.filter(word => !usedWords.includes(word));

    // const availableWords = generateCombinations(alphabet.split(''), 3) 
    //                         .filter(word => !usedWords.includes(word));

    if (availableWords.length === 0) {
      return null; // Signal that all words have been used
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  }

  function generateCombinations(letters, length) {
    const combinations = [];
    const generate = (prefix, remainingLength) => {
      if (remainingLength === 0) {
        combinations.push(prefix.join(''));
        return;
      }
      for (const letter of letters) {
        generate(prefix.concat(letter), remainingLength - 1);
      }
    };
    generate([], length);
    return combinations;
  }

  function searchGoogle(query, callback) {
    chrome.tabs.update(currentTabId, { url: `https://www.google.com/search?q=${encodeURIComponent(query)}` }, function () {
      // Wait for a short time to ensure the page is loaded before triggering the next search
      setTimeout(callback, 4000);
    });
  }
});
