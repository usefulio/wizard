// define transition

// Templates for indicators
// templates for buttons

// callbacks for allowing move to a step

// define each step

// dynamically add/remove a step

// events for moving forward/back

Wizard = {};

Wizard.mixin = function(template){
	template.onCreated(function(){
		var self = this;

		this.steps 			= new ReactiveVar([]);
		this.currentIndex 	= new ReactiveVar(0);

		this.activeClass	= 'wizard-active';
		this.inactiveClass	= 'wizard-inactive';
		this.completedClass	= 'wizard-complete';

		this.setClassForIndex = function(currentIndex, targetIndex, $el){
			if(targetIndex === currentIndex){
				if($el.hasClass(self.inactiveClass)){
					$el.removeClass(self.inactiveClass);
				}
				if($el.hasClass(self.completedClass)){
					$el.removeClass(self.completedClass);
				}
				if(!$el.hasClass(self.activeClass)){
					$el.addClass(self.activeClass);
				}
			}else if(targetIndex < currentIndex){
				if(!$el.hasClass(self.inactiveClass)){
					$el.addClass(self.inactiveClass);
				}
				if(!$el.hasClass(self.completedClass)){
					$el.addClass(self.completedClass);
				}
				if($el.hasClass(self.activeClass)){
					$el.removeClass(self.activeClass);
				}
			}else{
				if(!$el.hasClass(self.inactiveClass)){
					$el.addClass(self.inactiveClass);
				}
				if($el.hasClass(self.completedClass)){
					$el.removeClass(self.completedClass);
				}
				if($el.hasClass(self.activeClass)){
					$el.removeClass(self.activeClass);
				}
			}
		};

		this.setClasses = function(){
			var classSet = self.activeClass + " " + self.completedClass + " " + self.inactiveClass
				, currentIndex = self.currentIndex.get();
			
			self.$('.wizard-steps >*').each(function(elementIndex, el){
				self.setClassForIndex(currentIndex, elementIndex, $(el));
			});

			self.$('.wizard-indicators >*').each(function(elementIndex, el){
				self.setClassForIndex(currentIndex, elementIndex, $(el));
			});
		};

		this.moveToIndex = function(targetIndex){
			var currentIndex = this.currentIndex.get()
				, steps = this.steps.get()
				, self = this;

			if(currentIndex != targetIndex){
				if(targetIndex < 0){
					targetIndex = 0;
				}else if(targetIndex >= steps.length){
					targetIndex = steps.length - 1;
				}

				function move(err){
					if(_.isUndefined(err)){
						self.currentIndex.set(targetIndex);
						self.setClasses();
					}
				}

				if(_.isFunction(this.canMoveToIndex)){
					if(this.canMoveToIndex(targetIndex, currentIndex, steps, move)){
						move();
					}
				}else{
					move();
				}
			}
		};

		this.next = function(){
			self.moveToIndex(self.currentIndex.get()+1);
		};

		this.previous = function(){
			self.moveToIndex(self.currentIndex.get()-1);
		};

		this.init = function(){
			var steps = [];
			self.$('.wizard-steps >*').each(function(index, el){
				steps.push({
					label: $(el).data('step')
					, index: index
				});
			});
			self.steps.set(steps);
			if(self.currentIndex.get() >= self.steps.length){
				self.moveToIndex(self.steps.length - 1);
			}else{
				self.setClasses();
			}
		};
	});

	template.onRendered(function(){
		var self = this;
		this.find('.wizard-steps')._uihooks = {
			insertElement: function(node, next) {
				$(node).insertBefore(next);
				self.init();
			},
			moveElement: function (node, next) {
				$(node).remove();
				$(node).insertBefore(next);
			},
			removeElement: function (node) {
				$(node).remove();
				self.init();
			},
		}
		this.init();
	});

	template.onDestroyed(function(){

	});

	template.events({
		'click .next, tap .next': function (e, tmpl) {
			tmpl.next();
		}
		, 'click .previous, tap .previous': function (e, tmpl) {
			tmpl.previous();	
		}
		, 'click .wizard-indicators > .wizard-complete': function (e, tmpl) {
			tmpl.moveToIndex(this.index);
		}
	});

	template.helpers({
		steps: function () {
			return Template.instance().steps.get();
		}
		, numberOfSteps: function () {
			return Template.instance().steps.get().length;
		}
		, currentIndex: function () {
			return Template.instance().currentIndex.get();
		}
		, isFirstStep: function () {
			return Template.instance().currentIndex.get() === 0;
		}
		, isLastStep: function () {
			return Template.instance().currentIndex.get() === Template.instance().steps.get().length - 1;
		}
	});
};