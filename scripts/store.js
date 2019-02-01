'use strict';

const store = (function () {
  
  const addItem = function(item){
    Object.assign(item, {editing: false, collapse : false});
    this.items.push(item);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);  
  };

  const findAndUpdate = function(id, newData) {
    Object.assign(id, newData);
  };

  const findById = function(id) {
    return this.items.find(item => {
      return item.id === id;
    });
  };

  const setError = function(error){
    this.error = error; 
  };

  return{
    items: [],
    error: null, 

    addItem,
    findAndDelete, 
    findAndUpdate,
    findById,
    setError,
  };})();