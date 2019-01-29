'use strict';

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
        <option value="5-stars">5 Stars</option>
        <option value="4-stars">4 Stars or higher</option>
        <option value="3-stars">3 Stars or higher</option>
        <option value="2-stars">2 Stars or higher</option>
        <option value="A-to-Z">A - Z</option>
        <option value="Z-to-A">Z - A</option>
      </select>
    </form>`;
}

function renderBaseBottomPanel () {
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

function renderCollapseBottomPanel () {
  return `
    <ul class="bookmarks">
      <li class="bookmark" data-item-id=${item.id}>
        Rating ${item.rating} Title ${item.title}
        <div class="js-desciption">
          Description ${item.description} Link ${item.link}
        </div>
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

function handleNewItemSubmit(){
  $('.js-add-item').submit(function(event){
    event.preventDefault();
    const newItemTitle = $('.js-title-input').val();
    $('.js-title-input').val('');
    const newItemLink = $('.js-link-input').val();
    $('.js-link-input').val('');
    const newItemDescription = $('.js-description-input').val();
    $('.js-description-input').val('');
    const newItemRating = $('.js-rating-input').val();
    $('.js-rating-input').val('');
    const newItem = {
      'title': newItemTitle,
      'url': newItemLink,
      'desc': newItemDescription,
      'rating': newItemRating, 
    }
    api.createItem(newItem)

  }
}