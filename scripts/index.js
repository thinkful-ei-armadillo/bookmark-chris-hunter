/* global bookmarkList, store, api */
'use strict';

$(document).ready(function() {
  api.getItems() 
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarkList.render();
      bookmarkList.bindEventListeners();
    });
});