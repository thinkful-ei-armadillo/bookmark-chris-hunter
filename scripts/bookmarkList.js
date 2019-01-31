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
          <input type="text" value="Hats" class="js-title-input" required>
          <label for="link">Link</label>
          <input type="url" value="http://www.hats.com" class="js-link-input" required>
          <label for="description">Description</label>
          <input type="text" value="Hats" class="js-description-input" required>
          <label for="rating">Rating</label>
          <input type="number" value="4" min="1" max="5" class="js-rating-input" required>
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

  function generateEditItem(item) {
    return `
    <ul class="bookmarks">
    <li class="bookmark" data-item-id=${item.id}>
      <form for="edit">
        <label for="rating">Rating</label>
        <input type="number" class="js-edit-rating" value=${item.rating}
        min= "0" max= "5">
        <label for="title">Title</label>
        <input type="text" class="js-edit-title" value=${item.title}>
        <div class="js-desciption">
          <label for="description">Description</label>
          <input type="text" class="js-edit-description" value=${item.desc}>
          <label for="link">Link</label>
          <input type="url" class="js-edit-link" value=${item.url}>
        </div>
      </form>
      <input type="submit" class="js-submit-edit" value="Submit Changes">
      <button class= "js-edit" type="button">Nevermind</button>
      <label for="delete">
        <input type="submit" value="Delete" class="js-delete">
      </label>  
    </li>
  </ul>`;
  }

  function generateErrorPanel(message){
    return `
      <section class="error">
        <button id="cancel-error">Cancel</button>
        <p>${message}<p>
      </section>
    `;
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
    if(store.error){
      const error = generateErrorPanel(store.error); 
      $('.error-panel').html(error);
    }
    else{
      $('.error-panel').empty(); 
    }

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

  function handleNewItemClicked() {
    $('.js-top-panel').on('click', '.js-add-new-button', () => {
      add = true;
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
      };
      api.createItem(newItem)
        .then((response)=> {
          return response.json();})
        .then((responseJson)=>{
          store.addItem(responseJson);
          add = false; 
          render();   
        })
        .catch((err) => {
          store.setError(err.message);
          render();
        });  
    });
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
        })
        .catch((err)=>{
          store.setError(err.message);
          render(); 
        });  
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

  function handleEditItemSubmit() {
    $('.js-bottom-panel').on('click', '.js-submit-edit', function(event){
      event.preventDefault(); 
      let editItemTitle = $('.js-edit-title').val();
      $('.js-title-input').val('');
      let editItemLink = $('.js-edit-link').val();
      $('.js-link-input').val('');
      let editItemDescription = $('.js-edit-description').val();
      $('.js-description-input').val('');
      let editItemRating = $('.js-edit-rating').val();
      $('.js-rating-input').val('');
      const id = getItemIdFromElement(event.currentTarget);
      let editItem = {
        title: editItemTitle,
        url: editItemLink,
        desc: editItemDescription,
        rating: editItemRating 
      };   
      api.editItem(id, editItem)
        .then(()=>{
          const item = store.findById(id);
          store.findAndUpdate(item, editItem); 
          store.findAndUpdate(item, {editing: !item.editing});
          render(); 
        })
        .catch((err) => {
          store.setError(err.message);
          render(); 
        }); 
    });
  }

  function handleCloseError(){
    $('.error-panel').on('click', '#cancel-error', () =>{
      store.setError(null);
      render(); 
    }); 
  }


  function bindEventListeners() {
    handleNewItemClicked();
    handleNewItemSubmit();
    handleDeleteItemClicked();
    handleCollapseItemClicked();
    handleEditItemClicked();
    handleEditItemSubmit(); 
    handleCloseError();  
  }

  return {
    render,
    bindEventListeners, 
  };

})();