Books = new Mongo.Collection('books');

Books.attachSchema(new SimpleSchema({
  title: {
    type: String
    , min: 3
  }
  , author: {
    type: String
    , min: 3
  }
  , summary: {
    type: String
    , optional: true
  }
  , copies: {
    type: Number
    , min: 0
  }
}));

if (Meteor.isClient) {
  Wizard.mixin(Template.AddBookWizard);

  Template.AddBookWizard.onCreated(function(){
    this.canMoveToIndex = function(desiredIndex, currentIndex, steps, next){
      var valid = false;
      switch(currentIndex){
        case 0:
          valid = AutoForm.validateField("insertBookForm", "title", false)
          break;
        case 1:
          valid = AutoForm.validateField("insertBookForm", "author", false)
          break;
        case 2:
          valid = AutoForm.validateField("insertBookForm", "summary", false)
          break;
        case 3:
          valid = AutoForm.validateField("insertBookForm", "copies", false)
          break;
      }
      return valid;
    }
  });

  Template.BookList.helpers({
    books: function () {
      return Books.find();
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}
