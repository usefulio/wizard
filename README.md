# Useful:Wizard

The mixin that you can add to any Meteor Template to grant it Wizard powers.

Example:

**Client client/views/orders/new/newOrder.html**
```html
<template name="NewOrder">
	<ul class="wizard-steps">
		<li>
			Content of Step One
		</li>
		<li>
			Content of Step Two
		</li>
		<li class=>
			Content of Step Three
		</li>
	</ul>
</template>
```

**Client client/views/orders/new/newOrder.js**
```
Wizard.mixin(Template.NewOrder);
.
.
.
other code
```

**More examples are in the `/examples` folder**

# Installation

```
meteor add useful:wizard
```

# What you can do

## on the client in JS


### `Wizard.mixin(targetTemplate)`
##### targetTemplate (Blaze Template)

Adds wizard functionality to the `targetTemplate`. Place this at the top of your template js file.



### `templateInstance.next()` and `templateInstance.previous()`

Moves the wizard one step forward or backward, respectively.

In an `onCreated`/`onRendered`/`onDestroyed`, use `this.next()`/`this.previous()`.

In an event handler `'submit form': function(e, tmpl){ ... }` use `tmpl.next()`/`tmpl.previous`.


### `templateInstance.moveToIndex(targetIndex)`

Moves the wizard to the step identified by `targetIndex` if possible.

In an `onCreated`/`onRendered`/`onDestroyed`, use `this.moveToIndex(targetIndex)`.

In an event handler `'submit form': function(e, tmpl){ ... }` use `tmpl.moveToIndex(targetIndex)`.


### `templateInstance.canMoveToIndex(targetIndex, currentIndex, steps, move)`

You can optionally define a `this.canMoveToIndex` function in your template's `onCreated` hook.

It will receive as parameters:

* the `targetIndex` that the wizard is requesting to go to
* the `currentIndex` that the wizard is displaying right now
* the `steps` array that contains all the details of the steps your wizard currently contains
* a `move` function that you can use to asynchronously tell the wizard it is allowed to change indexes or not

E.g.

**Synchronous***
``` javascript
Wizard.mixin(Template.NewOrder);

Template.NewOrder.onCreated(function(){
	this.canMoveToIndex = function(targetIndex, currentIndex, steps, move){
		// only allow moving one step at a time, i.e. disable jumping
		return Math.abs(targetIndex - currentIndex) === 1;
	};
});
```

If the return value from `canMoveToIndex` is **truthy** then the move will be allowed.

**Asynchronous***
``` javascript
Wizard.mixin(Template.NewOrder);

Template.NewOrder.onCreated(function(){
	this.canMoveToIndex = function(targetIndex, currentIndex, steps, move){
		// save some stuff to the database, if no errors, allow the move
		Orders.insert({ userId: Meteor.userId() }, move);
	};
});
```

If you pass anything to the `move` callback, it will be interpreted as an error
and the move will be disallowed. To call move directly and allow the move, just
call `move()` passing nothing.

### `templateInstance.afterMove()`

Callback to run code after a transition has been completed.

``` javascript
Wizard.mixin(Template.NewOrder);

Template.NewOrder.onCreated(function(){
	this.afterMove = function(){
		// do something
	};
});
```


### `templateInstance.activeClass` and `templateInstance.inactiveClass` and `templateInstance.completedClass`

These are the css classes that will be applied to the different steps you define in your wizard.

The defaults are:

```
this.activeClass	= 'wizard-active';
this.inactiveClass	= 'wizard-inactive';
this.completedClass	= 'wizard-complete';
```

The best way to change this is in your template's `onCreated` hook.

The only non-changeable css class right now is your container for your steps must have the class `wizard-steps`.

## Template Helpers

You get the following template helpers for free:

### `{{currentIndex}}`

The index of the step that the wizard is currently on.

### `{{isFirstStep}}`

Boolean of whether the wizard is currently displaying the first step.

### `{{isLastStep}}`

Boolean of whether the wizard is currently displaying the last step.

### `{{numberOfSteps}}`

Returns the number of steps the wizard currently contains.

### `{{percentComplete}}`

Returns the percentage (0 - 100) "complete" the wizard is, e.g. step 2 out of 5 is will return `40`.

### `{{steps}}`

This is an array containing the details of your steps.

If you define your steps html with a `data-step='step label'` attribute, this array will contain that information.

E.g. `steps` might look like

```
[
	{ index: 0, label: 'Your Info' }
	, { index: 1, label: 'Payment Info' }
	, { index: 2, label: 'Confirmation' }
]
```

`{{steps}}` is most useful to create progress indicators/headers for your wizard, as described in the **Progress Indicators** section.


## Progress Indicators

What your progress indicators look like or whether you have them at all are completely up to you.

If you want the wizard to automatically apply `active`, `inactive` and `completed` css classes to your
indicators for you, you need to add the class `wizard-indicators` to the container of your progress indicators.

But you define what those classes actually do.

Here's an example of one way you can create progress indicators:

``` html
<template name="NewOrder">
	... wizard itself ...
	<ul class="wizard-indicators">
		{{#each steps}}
			<li>{{index}}. {{label}}</li>
		{{/each}}
	</ul>
</template>
```

## Materialize Slider CSS Theme

You can have indicators and transitions that closely model the
look and feel of the MaterializeCSS Slider component (yet as a wizard)
here http://materializecss.com/media.html by using the following
CSS in your project and applying the `transition-*` classes as you wish.

It also includes the `fullscreen` variation.

**HTML Example**
``` html
<template name="SendProposal">
	<div class="wizard fullscreen">
		<ul class="wizard-steps">
			<li class="transition-top">
				Content for Step One
			</li>
			<li class="transition-right">
				Content for Step Two
			</li>
			<li class="transition-right">
				Content for Step Three
			</li>
		</ul>

		<ul class="wizard-indicators">
			{{#each steps}}
				<li></li>
			{{/each}}
		</ul>
	</div>
</template>
```

**LESS Example**
``` less
@active-color: #4CAF50;
@inactive-color: #e0e0e0;
@transition-duration: 0.5s;

.transition(@rule){
	-webkit-transition: @rule;
	-moz-transition: @rule;
	-o-transition: @rule;
	-ms-transition: @rule;
	transition: @rule;
}

.transform(@rule){
	-webkit-transform: @rule;
	-moz-transform: @rule;
	-o-transform: @rule;
	-ms-transform: @rule;
	transform: @rule;
}

.wizard {
	position: relative;

	&.fullscreen {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		.wizard-steps {
			height: 100%;
			>* {
				top: 60px;
				padding-top: 20px;
			}
		}

		.wizard-indicators {
			z-index: 2;
			bottom: 30px;
		}
	}

	.wizard-steps {
		margin: 0;
		height: 400px;

		>* {
			opacity: 0;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: inherit;
			overflow: hidden;
			padding: 0 15% 60px;

			.transition(opacity @transition-duration ease-out, transform @transition-duration ease-out;);

			&.wizard-active {
				.transition(opacity @transition-duration ease-out @transition-duration, transform @transition-duration ease-out @transition-duration;);
				z-index: 2;
				opacity: 1;
			}

			&.transition-right {
				.transform(translateX(100px));
				&.wizard-active {
					.transform(translateX(0));
				}
			}

			&.transition-left {
				.transform(translateX(-100px));
				&.wizard-active {
					.transform(translateX(0));
				}
			}

			&.transition-top {
				.transform(translateY(-100px));
				&.wizard-active {
					.transform(translateY(0));
				}
			}

			&.transition-bottom {
				.transform(translateY(100px));
				&.wizard-active {
					.transform(translateY(0));
				}
			}
		}

	}

	.wizard-indicators {
		position: absolute;
		text-align: center;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0;

		>* {
			display: inline-block;
			position: relative;
			height: 16px;
			width: 16px;
			margin: 0 12px;
			background-color: @inactive-color;
			border-radius: 50%;

			.transition(background-color .3s);

			&.wizard-active {
				background-color: @active-color;
			}
		}

		.wizard-complete {
			cursor: pointer;
			background-color: lighten(@active-color, 40%);
		}
	}
}

```


# Why you might care

* It will adapt to dynamically adding/removing steps.
* Just add a `next` or `previous` css class to an element in your template/step, 
	and when clicked it will trigger the wizard to change.
* Progress indicators optional and completely customizable.
* If you are using indicators, clicking on any indicator for a step that was
	before the current step will automatically jump to that step.
* Transitions are all defined in CSS, if you can code it you can use it.
* Customizable css classes to mark active, inactive and completed steps.
* HTML Tag agnostic, use a ul+li, div+div, whatever you like.
* No special Spacebars `{{# ...}}` required, just powers your plain html.