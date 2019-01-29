'use strict';

const api = (
  function() {
  
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chris-hunter/bookmarks';
    const getItems = (function() {
      return fetch(BASE_URL);
    });

    const createItem = function(newItem){
      const newItemString = JSON.stringify(newItem); 
    
      return fetch(`${BASE_URL}`, {method: 'POST',
        body: newItemString,}); 
    };

    return {
      createItem, 
      getItems
    };

  });

