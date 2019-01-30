/* global store, api $ */
'use strict';

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function (){
  let add = false; 

  function generateBaseTopPanel () {
    return `
    <button class="js-add-new-button" type="button">
    Add New Bookmark
  </button>`;
  }

  function generateAddNewTopPanel () {
    return `
    <form class="js-add-item">
          <label for="title">Title</label>
          <input type="text" value="Hats" class="js-title-input">
          <label for="link">Link</label>
          <input type="url" value="http://www.hats.com" class="js-link-input">
          <label for="description">Description</label>
          <input type="text" value="Hats" class="js-description-input">
          <label for="rating">Rating</label>
          <input type="number" value="4" min="1" max="5" class="js-rating-input">
          <input type="submit" class="js-create-bookmark">
        </form>`;
  }

  function generateMiddlePanel () {
    return `
    <form class="js-filter-bookmarks">
      <select name="filter">
        <option value="All">All</option>
        <option value="5-stars">5 Stars</option>
        <option value="4-stars">4 Stars or higher</option>
        <option value="3-stars">3 Stars or higher</option>
        <option value="2-stars">2 Stars or higher</option>
        <option value="A-to-Z">A - Z</option>
        <option value="Z-to-A">Z - A</option>
      </select>
    </form>`;
  }

  function generateItemElement(item){
    return `
    <ul class="bookmarks">
      <li class="bookmark" data-item-id=${item.id}>
        Rating ${item.rating} Title ${item.title}
        <button class="js-collapse" type="button">Details</button>
        <button class= "js-edit" type="button">Edit</button>
        <label for="delete">
          <input type="submit" value="Delete" class="js-delete">
        </label>  
      </li>
    </ul>`;
  }


  function generateItemExpandedElement (item) {
    return `
    <ul class="bookmarks">
      <li class="bookmark" data-item-id=${item.id}>
        Rating ${item.rating} Title ${item.title}
        Description ${item.desc} URL <a href="${item.url}">${item.url}</a>
        <button class="js-collapse" type="button">Details</button>
        <button class= "js-edit" type="button">Edit</button>
        <label for="delete">
          <input type="submit" value="Delete" class="js-delete">
        </label>  
      </li>
    </ul>`;
  }


  function generateBookmarkItemsString(bookmarkList){
    const items = bookmarkList.map((item) => {
      if(item.editing)
      {
        return generateEditItem(item); 
      }
      else if (item.collapse === false) {
        return generateItemElement(item);
      }
      else {
        return generateItemExpandedElement(item);
      }
    });
    return items.join('');
  }

  function render() {
    let items = [...store.items];
    const bookmarkListItemsString = generateBookmarkItemsString(items);
    if(add){
      $('.js-top-panel').html(generateAddNewTopPanel);
    } 
    else{
      $('.js-top-panel').html(generateBaseTopPanel); 
    }
    $('.js-middle-panel').html(generateMiddlePanel);
    $('.js-bottom-panel').html(bookmarkListItemsString); 
  }

  function generateEditItem(item) {
    return `
    <ul class="bookmarks">
    <li class="bookmark" data-item-id=${item.id}>
      <form for="edit">
        <label for="rating">Rating</label>
        <input type="number" value=${item.rating}>
        <label for="title">Title</label>
        <input type="text" value=${item.title}>
        <div class="js-desciption">
          <label for="description">Description</label>
          <input type="text" value=${item.desc}>
          <label for="link">Link</label>
          <input type="url" value=${item.url}>
        </div>
      </form>
      <button class= "js-edit" type="button">Nevermind</button>
      <label for="delete">
        <input type="submit" value="Delete" class="js-delete">
      </label>  
    </li>
  </ul>`;
  }

  function getItemIdFromElement(item){
    return $(item)
      .closest('.bookmark')
      .data('item-id');
  }

  function handleDeleteItemClicked(){
    $('.js-bottom-panel').on('click', '.js-delete', (event) =>{
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteItem(id)
        .then(()=> {
          store.findAndDelete(id); 
          render();}); 
    });  
  }

  function handleCollapseItemClicked(){
    $('.js-bottom-panel').on('click', '.js-collapse', (event) =>{
      const id = getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      store.findAndUpdate(item, {collapse: !item.collapse});
      render();
    });
  }

  function handleEditItemClicked() {
    $('.js-bottom-panel').on('click', '.js-edit', (event) =>{
      const id = getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      store.findAndUpdate(item, {editing: !item.editing});
      render();
    });
  }

  function handleNewItemSubmit(){
    $('.js-top-panel').submit(function(event){
      event.preventDefault(); 
      let newItemTitle = $('.js-title-input').val();
      $('.js-title-input').val('');
      let newItemLink = $('.js-link-input').val();
      $('.js-link-input').val('');
      let newItemDescription = $('.js-description-input').val();
      $('.js-description-input').val('');
      let newItemRating = $('.js-rating-input').val();
      $('.js-rating-input').val('');
      let newItem = {
        title : newItemTitle,
        url : newItemLink,
        desc : newItemDescription,
        rating : newItemRating,
        collapse : false,
        edit : false
      };
      api.createItem(newItem)
        .then((response)=> {
          return response.json();})
        .then((responseJson)=>{
          store.addItem(responseJson);
          add = false; 
          render();   
        }); 
    });
  }

  function handleNewItemClicked() {
    $('.js-top-panel').on('click', '.js-add-new-button', () => {
      add = true;
      render();  
    });
  }

  function bindEventListeners() {
    handleNewItemClicked();
    handleNewItemSubmit();
    handleDeleteItemClicked();
    handleCollapseItemClicked();
    handleEditItemClicked(); 
  }

  return {
    getItemIdFromElement, 
    render,
    bindEventListeners, 
  };

})();