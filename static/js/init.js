var app;
$(function  () {
  // Init App 
  app = new App();
  
  // Handle events
  handleEvents();

  // Init third party items
  $(".item-list").sortable();
});