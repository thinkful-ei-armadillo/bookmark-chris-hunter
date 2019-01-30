/* global store, api $ */
'use strict';

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function (){

  function renderBaseTopPanel () {
    return `
    <button class="js-add-new-button" type="button">
    Add New Bookmark
  </button>`;
  }

  function renderAddNewTopPanel () {
    return `
    <form class="js-add-item">
          <label for="title">Title</label>
          <input type="text" class="js-title-input">
          <label for="link">Link</label>
          <input type="text" class="js-link-input">
          <label for="description">Description</label>
          <input type="text" class="js-description-input">
          <label for="rating">Rating</label>
          <input type="text" class="js-rating-input">
          <input type="submit" class="js-create-bookmark">
        </form>`;
  }

  function renderBaseMiddlePanel () {
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

  function generateBookmarkItemsString(bookmarkList){
    const items = bookmarkList.map((item) => {
      if (item.collapse === false) {
        return generateItemElement(item);
      }
      else {
        return renderCollapseBottomPanel(item);
      }
    });
    return items.join('');
  }

  function renderBaseBottomPanel () {
    let items = [...store.items];

    const bookmarkListItemsString = generateBookmarkItemsString(items); 


    $('.js-bottom-panel').html(bookmarkListItemsString); 
    
  }

  function renderCollapseBottomPanel (item) {
    return `
    <ul class="bookmarks">
      <li class="bookmark" data-item-id=${item.id}>
        Rating ${item.rating} Title ${item.title}
        Description ${item.description} URL ${item.url}
        <button class="js-collapse" type="button">Details</button>
        <button class= "js-edit" type="button">Edit</button>
        <label for="delete">
          <input type="submit" value="Delete" class="js-delete">
        </label>  
      </li>
    </ul>`;
  }

  function renderEditBottomPanel () {
    return `
    <ul class="bookmarks">
    <li class="bookmark" data-item-id=${item.id}>
      <form for="edit">
        <label for="rating">Rating</label>
        <input type="text" placeholder=${item.rating}>
        <label for="title">Title</label>
        <input type="text" placeholder=${item.title}>
        <div class="js-desciption">
          <label for="description">Description</label>
          <input type="text" placeholder=${item.description}>
          <label for="link">Link</label>
          <input type="text" placeholder=${item.link}>
        </div>
      </form>
      <button class="js-collapse" type="button">Details</button>
      <button class= "js-edit" type="button">Edit</button>
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
          render();
        }); 
    });
  }

  function handleCollapseItemClicked() {
    $('.js-bottom-panel').on('click', '.js-collapse', (event) =>{
      const id = getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      store.findAndUpdate(item, {collapse: !item.collapse});
      renderBaseBottomPanel(item);
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
          render();   
        }); 
    });
  }

  function render() {
    $('.js-top-panel').html(renderBaseTopPanel);
    $('.js-middle-panel').html(renderBaseMiddlePanel);
    $('.js-bottom-panel').html(renderBaseBottomPanel);
    bindEventListeners(); 
  }

  function handleNewItemButton() {
    $('.js-add-new-button').on('click', () => {
      $('.js-top-panel').html(renderAddNewTopPanel);
      $('.js-middle-panel').html(renderBaseMiddlePanel);
      $('.js-bottom-panel').html(renderBaseBottomPanel);
    });
  }

  function bindEventListeners() {
    handleNewItemButton();
    handleNewItemSubmit();
    handleDeleteItemClicked();
    handleCollapseItemClicked();
  }

  return {
    getItemIdFromElement: getItemIdFromElement, 
    render: render,
    bindEventListeners: bindEventListeners
  };

})();