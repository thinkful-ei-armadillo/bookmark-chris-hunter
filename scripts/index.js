'use strict';

$(document).ready(function() {
  bookmarkList.bindEventListeners();
  bookmarkList.render();

  api.getItems() 
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarkList.render();
      console.log(items);
    });
});