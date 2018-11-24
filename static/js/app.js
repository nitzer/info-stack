/**
 * Item Constructor
 */
class Item {
    constructor(description, image, id){        
        this._id = id;
        this.description = description;
        this.image = image;
    }
}

/**
 * Items Collection Constructor
 */
class Items {
    constructor(data) {
        this.items = [];
        this.set(data);
    }

    get(_id) {
        for (var i=0; i < this.items.length; i++) {
            if (this.items[i]._id === _id) {
                return this.items[i];
            }
        }
    }

    set(data) {
        console.log('data.stat:' + data.stat);
        console.log('data.items.lenght:' + data.items.length);
        if(data.stat == 'ok'){
            for(var i = 0; i < data.items.length; i++){
                // I could be sending directly the Item response, but I find it less secure
                var item = data.items[i]
                this.items.push(new Item(item.description, item.position, item._id))
            }
        }
    }

    /**
     * Add a new item to the collection
     * @param {[type]} data [description]
     */
    add(data) {
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
 * ItemView Constructor
 * @param Item item
 */
class ItemView {
    
    constructor(item){

        this.selector = '';
        this.hideClass = 'd-none';
        this.html = ''

        if( item instanceof Item){
            this.item = item;
            this.createView(this.item)
        }

    }
    
    createView(item){
        console.log(this.item)
        this.html = $( ''
            + '<li class="item" data-id="'+ item._id +'">'
            + '  <div class="card mb-3">'
            + '    <div class="card-body">'
            + '      <img src="https://placehold.it/50x50" class="img-thumbnail float-left mr-3">'
            + '      <p class="card-text">'+ item.description +'</p>'
            + '      <button class="btn btn-sm btn-primary" data-id="'+ item._id +'">Edit</button>'
            + '      <button class="btn btn-sm btn-primary" data-id="'+ item._id +'">Delete</button>'
            + '    </div>'
            + '  </div>'
            + '</li>')      
    }
}

class FormView {
    
    constructor(selector){
        this.selector = selector
    }

    show() {
        $(this.selector).removeClass(this.hideClass)
    }

    hide() {
        $(this.selector).addClass(this.hideClass)
    }
}

class EditFormView extends FormView {

    constructor(selector) {
        super(selector)
        this.formDescriptionInput = '#editFormDescription';
    }

    load(item){
        if(item instanceof Item){
            $(this.formDescriptionInput).val(item.description)
        }
    }
}

class AddFormView extends FormView{
    constructor(selector){
        super(selector)
    }
}

/**
 * Container View Object
 * @param string selector Jquery element selector
 * @param ItemCollection itemCollection A collection of items for populating the container
 */
class ItemsContainer {
    constructor(selector, itemCollection){
        this.selector = selector;

        if(itemCollection instanceof Items){
            console.log('itemCollection is instance of Items')
            // clear the container
            this.clear()
            console.log(itemCollection.items.length)
            // add the items from the collection to the container
            for(var i = 0; i < itemCollection.items.length; i++){
                this.append(new ItemView(itemCollection.items[i]))
            }
        }
        return this;
    }

    /**
     * Append a ItemView to the Container
     * @param  ItemView itemView Item associated View
     * @return void
     */
    append(itemView) {
        if(itemView instanceof ItemView){
            // Append the html view of the Item
            $(this.selector).append(itemView.html)
        }
    }

    /**
     * Clear the container
     * @return void
     */
    clear() {
        $(this.selector).html('')
    }
}

class ItemApp{
    constructor(){
        
        this.items = {};
        this.itemContainer = {};
        this.editFormView = {};
        this.addFormView = {};

        this.setItemContainer()
        var self = this;
    }
    
    _addItem(item) {
        var newItem = item
        // wait for api's data response
        return new Promise(function(resolve, reject){
            $.post('/add', {
                'description': newItem.description,
                'image': newItem.image,
            }, function(response){
                resolve(response)
            }).fail(function(error){
                reject(error)
            });
        })
    }

    _getItems() {
        // wait for api's data response
        return new Promise(function(resolve, reject){
            $.getJSON('/get', function(data){
                resolve(data)
            }).fail(function(error){
                reject(error)
            });
        })
    }

    _updateItem(item) {
        var updateItem = item 
        // wait for api's data response
        return new Promise(function(resolve, reject){
            $.post('/update', updateItem, function(data){
                resolve(data)
            }).fail(function(error){
                reject(error)
            });
        });
    }

    _deleteItem(item) {
        // wait for api's data response
        return new Promise(function(resolve, reject){
            $.post('/update', item, function(data){
                resolve(data)
            }).fail(function(error){
                reject(error)
            });
        });
    }

    showEditForm() {
        
    }

    /**
     * Update the item container with the itemCollection
     * @return {[type]} [description]
     */
    setItemContainer() {
        var self = this
        this._getItems().then(function(data){
            console.log(data)
            self.items = new Items(data)
            self.itemContainer = new ItemsContainer('.item-list', self.items)
        })
    }
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
    $('.addItem').on('click', function(event){
        event.preventDefault()
        itemApp.add()
    });

    // bind add button
    $('.deleteItem').on('click', function(event, item){
        event.preventDefault()
        console.log(item)
        itemApp.delete()
    });

    // bind add button
    $('.updateItem').on('click', function(event){
        event.preventDefault()
        itemApp.update()
    });

    console.log('Added event handlers')
}

