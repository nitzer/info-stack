/**
 * Item
 * Create a new item
 * @param string description Item's description
 * @param string image Item's image
 * @param string id Item's id
 */
class Item {
    constructor(description, image, id){        
        this._id = id;
        this.image = image;
        this.description = description;
    }
}

/**
 * Items
 * Create a collection of items from a JSON response
 * @param JSON.string data The API's response object with the item attribute
 */
class Items {
    constructor(data) {
        this.items = [];
        this.set(data);
    }

    /**
     * Search an Item by it's id
     * @param  string _id 
     * @return Item  Return an item from the collection
     */
    get(_id) {
        for (var i=0; i < this.items.length; i++) {
            if (this.items[i]._id === _id) {
                return this.items[i];
            }
        }
    }

    /**
     * Populate the Items collection from the response from the API
     * @param Json.string data The response from the API with the items attribute
     * @return undefined
     */
    set(data) {
        console.log('data.stat:' + data.stat);
        console.log('data.items.lenght:' + data.items.length);
        if(data.stat == 'ok'){
            for(var i = 0; i < data.items.length; i++){
                // I could be sending directly the Item response, but I find it less secure
                var item = data.items[i]
                this.items.push(new Item(item.description, item.image, item._id))
            }
        }
    }

    /**
     * Return the amount of items inside the collection
     * @return integer The amount of items in the collection
     */
    count(){
        return this.items.length;
    }
}

/**
 * ItemView
 * @param Item item
 * Create a new Item element
 */
class ItemView {
    /**
     * Create the item view, setup the selector and common classes 
     * for the objects extending it and create a view
     * @param  Item item Item object
     * @return undefined
     */
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
        this.html = $( ''
            + '<li class="item" data-id="'+ item._id +'">'
            + '  <div class="media mb-3">'
            + '    <img height="150px" src="/uploads/'+ item.image +'" class="align-self-start mr-3">'
            + '    <div class="media-body">'
            + '      <p class="media-text">'+ item.description +'</p>'
            + '      <button class="btn btn-sm btn-primary editItem" data-id="'+ item._id +'">Edit</button>'
            + '      <button class="btn btn-sm btn-primary deleteItem" data-id="'+ item._id +'">Delete</button>'
            + '    </div>'
            + '  </div>'
            + '</li>')
    }

    /**
     * Return the HTML for the item 
     * @return string The element HTML 
     */
    get(){
        return this.html;
    }
}

/**
 * AlertView
 * Display alerts on top of the page
 */
class AlertView{
    /**
     * Create the HTML representation of the alert, clear the message 
     * container and add the new alert
     * @param  string type Level of Alert (info, success, danger, warning)
     * @param  string message The message for the alert
     * @return undefined
     */
    constructor(type, message){
        this.selector = '#message'
        this.message = message
        this.type = type
        $(this.selector).html(this.createElement())
        
    }

    /**
     * Create the element HTML
     * @return string HTML element of the alert
     */
    createElement(){
        return $(''
            + '<div class="alert alert-'+ this.type +' alert-dismissible fade show" role="alert">'
            +'  '+ this.message
            +'  <button type="button" class="close" data-dismiss="alert" aria-label="Close">'
            +'    <span aria-hidden="true">&times;</span>'
            +'  </button>'
            +'</div>'
        )
    }
}

/**
 * Form view object with common functionalities for all the formViews
 */
class FormView {

    /**
     * Define an css selector and base clases for hiding the element
     * @param  string selector The CSS selector for the created form
     * @return undefined
     */
    constructor(selector){
        this.selector = selector
        this.hideClass = 'd-none'
    }

    /**
     * Remove hide class from the form view container
     * @return undefined
     */
    show() {
        $(this.selector).removeClass(this.hideClass)
    }

    /**
     * Add the hide class from the form view container
     * @return undefined
     */
    hide() {
        $(this.selector).addClass(this.hideClass)
    }
}

class EditItemFormView extends FormView {

    /**
     * Extends the FormView class and calls parent's constructor 
     * with the form selector
     * @param  string selector edit form CSS selector
     * @return undefined
     */
    constructor(selector) {
        super(selector)
        this.formIdInput = '#editFormId';
        this.formDescriptionInput = '#editFormDescription';
    }

    /**
     * Load the item into the form
     * @param  Item item Item's object
     * @return undefined
     */
    load(item){
        if(item instanceof Item){
            console.log(item._id)
            $(this.formIdInput).val(item._id)
            $(this.formDescriptionInput).val(item.description)
        }
    }
}

class DeleteItemFormView extends FormView {

    /**
     * Extends the FormView class and calls parent's constructor 
     * with the form selector
     * @param  string selector delete form CSS selector
     * @return undefined
     */
    constructor(selector) {
        super(selector)
        this.formIdInput = '#deleteFormId';
        this.deleteItemId = '#deleteItemId'
    }

    /**
     * Load the item into the form
     * @param  Item item Item's object
     * @return undefined
     */
    load(item){
        if(item instanceof Item){
            console.log(item._id)
            $(this.deleteItemId).html(item._id)
            $(this.formIdInput).val(item._id)
        }
    }
}

/**
 * Extends the FormView class and calls parent's constructor 
 * with the form selector
 * @param  string selector edit form CSS selector
 * @return undefined
 */
class AddItemFormView extends FormView{
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
    /**
     * Define a selector and load the item collection into the container
     * @param  string selector Container CSS selector
     * @param  Items itemCollection Item Collection
     * @return undefined
     */
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
    /**
     * Set up the app with the collection, forms and containers
     * @return undefined
     */
    constructor(){
        
        this.items = {};
        this.itemContainer = {};
        this.editItemFormView = new EditItemFormView('.editform');
        this.addItemFormView = new AddItemFormView('.addform');
        this.deleteItemFormView = new DeleteItemFormView('.deleteform');
        this.setItemContainer();
    }
    
    /**
     * Promise to get the items from the API response
     * @return Promise JSON Data if is resolved, error Information 
     * if it's rejected 
     */
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

    /**
     * Hide all the forms then populate the delete form and display it
     * @param  Item item Item to loaded in the form
     * @return undefined
     */
    showDeleteItemForm(item) {
        this.hideForms()
        this.deleteItemFormView.load(item)
        this.deleteItemFormView.show()
    }

    /**
     * Hide all the forms then populate the edit form and display it
     * @param  Item item Item to loaded in the form
     * @return undefined
     */
    showEditItemForm(item) {
        this.hideForms()
        this.editItemFormView.load(item)
        this.editItemFormView.show()
    }

    /**
     * Hide all the forms display the add form
     * @param  Item item Item to loaded in the form
     * @return undefined
     */
    showAddItemForm(){
        this.hideForms()
        this.addItemFormView.show()
    }

    /**
     * Displays an alert on top of the page
     * @param  string  type level of alert
     * @param  string message alert's message
     * @return undefined
     */
    showAlert(type, message){
        new AlertView(type, message);
    }

    /**
     * Hide all the forms
     * @return undefined
     */
    hideForms(){
        this.addItemFormView.hide()
        this.editItemFormView.hide()
        this.deleteItemFormView.hide()
    }
    
    /**
     * Update the item container with the itemCollection
     * @return undefined
     */
    setItemContainer() {
        var self = this
        this._getItems().then(function(data){
            console.log(data)
            self.items = new Items(data)
            self.itemContainer = new ItemsContainer('.item-list', self.items)
            self.attachItemContainerEventHandlers()
            self.updateItemCounter()
        })
    }

    /**
     * Update's the total amount of items
     * @return undefined
     */
    updateItemCounter(){
        $('#item-counter').html(this.items.count())
    }

    /**
     * Attach the item container events for edit item and delete item,
     * Capture the forms submit and do it over AJAX
     * @return undefined
     */
    attachItemContainerEventHandlers(){
        var self = this;

        $('#addItem').on('click', function(){
            self.showAddItemForm()
        })

        $('.editItem').on('click', function(event){
            // get Item's using jQuery Dataset
            var item = self.items.get(event.target.dataset.id)
            self.showEditItemForm(item)
        })

        $('.deleteItem').on('click', function(event){
            var item = self.items.get(event.target.dataset.id)
            self.showDeleteItemForm(item)
        })

        $(document).on("submit", "form", function(event){
            event.preventDefault();

            var url=$(this).attr("action");
            $.ajax({
                url: url,
                type: $(this).attr("method"),
                dataType: "JSON",
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function (data, status)
                {
                    var type = ""
                    var message = ""
                    
                    if(data.stat == "ok"){
                        type="success";
                        message = data.message
                        self.setItemContainer()
                        self.hideForms()
                    }else{
                        type="danger"
                        message = data.error 
                    }

                    self.showAlert(type, message)
                    console.log(data)
                },
                error: function (xhr, desc, err)
                {
                    self.setItemContainer()
                    self.showAlert('danger', err)
                }
            });        
        });
    }
}
