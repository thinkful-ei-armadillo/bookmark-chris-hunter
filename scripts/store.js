'use strict';

const store = function () {
  const addItem = function(item){
    this.items.push(item); 
  };
  return{
    addItem,
    items: [], 
  };};