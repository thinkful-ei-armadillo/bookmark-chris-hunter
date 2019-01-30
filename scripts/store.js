'use strict';

const store = (function () {
  const addItem = function(item){
    this.items.push(item); 
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);  
  };

  return{
    findAndDelete, 
    addItem,
    items: [], 
  };})();