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

  async function recursiveSearch(remainingSearches) {
    if (remainingSearches > 0) {
      generateRandomWord(async function (randomWord) {
        if (randomWord) {
          usedWords.push(randomWord);
          await searchGoogle(randomWord);
          recursiveSearch(remainingSearches - 1);
        } else {
          usedWords = [];
          alert('All words have been used. Resetting the list.');
        }
      });
    }
  }

  async function generateRandomWord(callback) {
    const url = 'https://random-word-by-api-ninjas.p.rapidapi.com/v1/randomword?type=verb';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '803abccaf4msh0cd3dec355642d5p1282bdjsnbe14ce508bf1',
        'X-RapidAPI-Host': 'random-word-by-api-ninjas.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const randomWord = result[0].word;
      callback(randomWord);
    } catch (error) {
      console.error('Error fetching random word:', error);
      callback(null);
    }
  }

  async function searchGoogle(query) {
    return new Promise(resolve => {
      chrome.tabs.update(currentTabId, { url: `https://www.google.com/search?q=${encodeURIComponent(query)}` }, function () {
        setTimeout(resolve, 2000);
      });
    });
  }
});
