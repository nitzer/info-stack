/**
 * Info Stack Object
 */
App.prototype = {

    'init': function(obj){
        this.get()
    },

    /**
     * item list
     * @type Array
     */
    items: [],

    /**
     * Get the items from the API
     * @return {object} An object with all items
     */
    'get':  function(){
        var self = this;
        $.getJSON('/get', function(data){
            self.updateList(data);
            self.items = data.items;
            self.updateCounter()
        })
    },
    
    /**
     * Delete an item from the list
     * @return {[type]} [description]
     */
    'delete': function(id){
        var self = this;
        $.getJSON('/delete/' + id , function(data){

        });
    },
    
    'calculateItemsPosition': function(){
        var self = this;
        $.each($('.item'), function(){
            console.log(this._id)
        })
    },

    /**
     * Update an item
     * @return boolean
     */
    'update': function(){

    },
    
    /**
     * Add a new item to the form
     * @return boolean
     */
    'add':  function(formObject){
        console.log('add')
    },

    'updateCounter': function(){
        $('#item-counter').html(this.items.length)
    },

    /**
     * Update item container
     * @return void
     */
    'updateList': function(data){
        
        container = $('.item-list')
        container.html('')

        $.each(data.items, function(index, item){
            itemHtml = ''
                + '<li class="item" data-id="'+item._id+'">'
                + '  <div class="card mb-3">'
                + '    <div class="card-body">'
                + '      <img src="https://placehold.it/50x50" class="img-thumbnail float-left mr-3">'
                + '      <p class="card-text">'+item.description+'</p>'
                + '      <a href="#" class="btn btn-sm btn-primary" data-id="'+item._id+'">Edit</a>'
                + '      <a href="#" class="btn btn-sm btn-primary" data-id="'+item._id+'">Delete</a>'
                + '    </div>'
                + '  </div>'
                + '</li>'

            container.append(itemHtml)
        })
    }
}

/**
 * Initializes the app and populates the item list
 * @return Object App
 */
function App(){
    this.init()
}
