
/**
 * Item Object model
 * @type {Object}
 */
Item.prototype = {
    _id: '',
    name: '',
    image: '',
    position: '',
    update: function(){
        var self = this
        $.post('/update',{
            '_id': self._id,
            'description': self.description,
            'image': self.image,
            'position': self.position
        })
    },
    delete: function(){
        var self = this;
        $.post('/delete',{
            _id: self._id
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

/**
 * Item Collection
 * @type Model
 */
Items.prototype = {
    /**
     * Item Collection
     * @type Array
     */
    items: [],

    /**
     * Get all the items
     * @return {[type]} [description]
     */
    get: function(){
        return this.items;
    },

    'set': function(data){
        var self = this;
        $.each(data.items,function(index, item){
            // I could be sending directly the Item response, but I find it less secure
            self.items.push(new Item(item.description, item.position, item._id))
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
function Items(data){
    var self = this;
    // Initialize collection
    $.each(data.items,function(index, item){
        // I could be sending directly the Item response, but I find it less secure
        self.items.push(new Item(item.description, item.position, item._id))
    })
}


/**
 * ItemView Prototype
 * @type ItemView
 */
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

/**
 * ItemView Constructor
 * @param Item item
 */
function ItemView(item){
    if( item instanceof Item){
        this.item = item;
    }
}

/**
 * ContainerView Prototype
 * @type ContainerView
 */
ItemsContainer.prototype = {
    selector: '',

    /**
     * Append a ItemView to the Container
     * @param  ItemView itemView Item associated View
     * @return void
     */
    append: function(itemView){
        if(itemView instanceof ItemView){
            // Append the html view of the Item
            $(this.selector).append(itemView.toHtml())
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
 * @param ItemCollection itemCollection A collection of items for populating the container
 */
function ItemsContainer(selector, itemCollection){
    // set the view's selector
    this.selector = selector
    if(itemCollection instanceof Items){
        console.log('itemCollection is instance of Items')
        // clear the container
        this.clear()

        console.log(itemCollection.items.length)
        // add the items from the collection to the container
        for(i = 0; i < itemCollection.items.length; i++){
            this.append(new ItemView(itemCollection.items[i]))
        }
    }
}

ItemApp.prototype = {
    'itemCollection': {},
    'itemsContainer': {},

    'init': function(){
        var self = this
        // Wait for the items promise to be fulfilled to update the itemCollection
        // and set the itemContainer
        this.getItems().then(function(data){
            self.itemCollection = new Items(data)
            self.setItemContainer()
        })

    },

    'getItems': function(){
        // wait to item data response
        return new Promise(function(resolve, reject){
            $.getJSON('/get', function(data){
                resolve(data)
            }).fail(function(error){
                reject(error)
            });
        })
    },

    'updateItem': function(item){

    },

    /**
     * Get a new Item collection
     * @return {[type]} [description]
     */
    'getItemCollection': function(){
        return new Promise(function(resolve, reject){
            itemCollection = new Items()
            resolve(itemCollection)
        });
    },

    /**
     * Update the item container with the itemCollection
     * @return {[type]} [description]
     */
    'setItemContainer': function(){
        this.itemsContainer = new ItemsContainer('.item-list', this.itemCollection)
    },

    /**
     * Tells the itemCollection to get a new set of items
     * this is for checking async adds to the item stack (db)
     * @return void
     */
    'updateCollection': function(){
        this.itemCollection.get()
    }
}

function ItemApp(){
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

