/**
 * Item Collection
 * @type Model
 */
Items.prototype = {
    /**
     * Item Collection
     * @type Array
     */
    collection: [],

    /**
     * Get all the items
     * @return {[type]} [description]
     */
    get: function(){
        var self = this;
        self.collection = [];
        $.getJSON('/get', function(data){
            $.each(data.items,function(index, item){
                // I could be sending directly the Item response, but I find it less secure
                self.collection.push(new Item(item.description, item.position, item._id))
            })
        })
    },

    /**
     * Add a new item to the collection
     * @param {[type]} data [description]
     */
    add: function(data){
        var self = this
        $.post('/add', {
            'description': data.description, 
            'image': data.image
        }, function(response){
            self.collection.push(new Item(description, name, response._id))
        })
    }
}

/**
 * Items Collection Constructor
 */
function Items(){
    // Initialize collection
    this.get();
}

/**
 * [prototype description]
 * @type {Object}
 */
Item.prototype = {
    _id: '',
    name: '',
    image: '',
    position: '',
    update: function(){
        $.post('/update',{
            'description': this.description,
            'image': this.image,
            'position': this.position
        })
    },
    delete: function(){
        $.post('/delete',{
            _id: this._id
        })
    }
}

/**
 * Item Model Constructor
 */
function Item( description, image, id) {
    this._id = id;
    this.description = description;
    this.image = image;
}

ItemView.prototype = {
    item: {},
    toHtml: function(){
        itemHtml = ''
            + '<li class="item" data-id="'+this.item._id+'">'
            + '  <div class="card mb-3">'
            + '    <div class="card-body">'
            + '      <img src="https://placehold.it/50x50" class="img-thumbnail float-left mr-3">'
            + '      <p class="card-text">'+this.item.description+'</p>'
            + '      <a href="#" class="btn btn-sm btn-primary" data-id="'+this.item._id+'">Edit</a>'
            + '      <a href="#" class="btn btn-sm btn-primary" data-id="'+this.item._id+'">Delete</a>'
            + '    </div>'
            + '  </div>'
            + '</li>'
        return itemHtml
    }
}

ContainerView.prototype = {
    selector: '',
    /**
     * Append a ItemView to the Container
     * @param  ItemView itemView Item associated View
     * @return void
     */
    append: function(itemView){
        if(itemView instanceof ItemView){
            $(this.selector).append(itemView)
        }
    },

    /**
     * Clear the container
     * @return void
     */
    clear: function(){
        $(this.selector).html('')
    }
}

/**
 * Container View Object
 * @param string selector Jquery element selector
 */
function ContainerView(selector, itemCollection){
    // set the view's selector
    this.selector = selector
    if(itemCollection instanceof Items){
        // clear the container
        this.clear()
        for(i = 0; i < itemCollection.items.length; i++){
            this.append(new ItemView(itemCollection.item[i]))
        }
    }
}

function ItemView(item){
    if( item instanceof Item){
        this.item = item;
    }
}

ItemApp.prototype = {
    
    ItemCollection: {},
    ItemContainer: {},

    init: function(){
        this.ItemCollection = new Items()
        this.ItemContainer = new ItemContainer('#item-list')
    },
    updateCollection: function(){
        this.itemCollection.get()
    },
    updateItemContainer: function(){

    }
}

function ItemApp(){
    this.init();
}

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
     * Calculate item position on the list
     * @return void
     */
    'calculateItemsPosition': function(){
        var self = this;
        $.each($('.item'), function(){
            console.log(this._id)
        })
    },
    
    /**
     * Add a new item to the form
     * @return boolean
     */
    'add':  function(formObject){
        console.log('add')
    },

    /**
     * Update an item
     * @return boolean
     */
    'update': function(){
        console.log('update')
    },

    /**
     * Delete an item from the list
     * @return {[type]} [description]
     */
    'delete': function(id){
        console.log('delete')
    },

    /**
     * Update the item counter on the page
     * @return {[type]} [description]
     */
    'updateCounter': function(){
        $('#item-counter').html(this.items.length)
    },

    /**
     * Update item container
     * @return void
     */
    'updateList': function(data){
        
        // get the container and clean it
        container = $('.item-list')
        // todo: Create a get hash to not clean it every time maybe?
        container.html('')

        // this sucks, but I cannot use a template engine like Moustache.js :()
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
        });
    }
}

/**
 * Initializes the app and populates the item list
 * @return Object App
 */
function App(){
    // call function init to get the list and put it in the container
    this.init()
}

// event handlers outside the App class
function handleEvents(){
    // prevent hitting enter
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    // bind add button
    $('#addItem').on('click', function(event){
        event.preventDefault()
        app.add()
    });

    // bind add button
    $('.deleteItem').on('click', function(event){
        event.preventDefault()
        app.delete()
    });

    // bind add button
    $('#updateItem').on('click', function(event){
        event.preventDefault()
        app.update()
    });

    console.log('Added event handlers')
}

