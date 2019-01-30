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
    const item = this.findByID(id);
    Object.assign(item, newData);
  };

  const findById = function(id) {
    return this.items.find(item => {
      item.id === id;
      console.log(item);
    });
  };

  return{
    findAndDelete, 
    addItem,
    items: [],
    findAndUpdate,
    findById
  };})();