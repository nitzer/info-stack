// for testing proposes I change the scope of itemApp to be 
// available on the browser'sjavascript console
var itemApp;

$(function  () {
  // Init App 
  itemApp = new ItemApp();

  // Init third party modules
  $(".item-list").sortable();
});