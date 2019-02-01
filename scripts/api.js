
'use strict';

const api = (
  function() {
  
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chris-hunter/bookmarks';
    
    const getItems = function() {
      return listApiFetch(BASE_URL);
    };

    const listApiFetch = function(url, options){
      let error = false; 
      return fetch(url, options)
        .then(res => {
          if(!res.ok){
            error = true; 
          }
          return res.json(); 
        })
        .then(data => {
          if(error) throw new Error(data.message); 
          return data; 
        }); 
    };

    const createItem = function(newItem){
      const newItemString = JSON.stringify(newItem); 
      return listApiFetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        }, 
        body: newItemString,}); 
    };

    const deleteItem = function(id){
      return listApiFetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',  
      }); 
    }; 

    const editItem = function(id, editItem){
      const editItemString = JSON.stringify(editItem);
      return listApiFetch(`${BASE_URL}/${id}`,{
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        }, 
        body: editItemString,});
    };

    return {
      getItems,
      createItem, 
      deleteItem,
      editItem,
    };

  })();

