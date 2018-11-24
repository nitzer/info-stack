var itemApp;
$(function  () {
  // Init App 
  itemApp = new ItemApp();
  
  // Handle events
  handleEvents();

  // Init third party items
  $(".item-list").sortable();
});