/*! Validation.js 3.0.0
 * ©2016 Omur Yildrim - ignorethedark.com
 */

/**
 * @summary     Validation.js
 * @description Validate, listen and examine HTML inputs
 * @version     3.0.0
 * @file        jquery.validation.js
 * @author      .. .. . . .
 * @contact     ignorethedark.com
 * @copyright   Copyright 2016 Omur Yildirim
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://ignorethedark.com/validation - https://github.com/omuryildirim/validation
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
 * THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * For details please refer to:
 *	 http://ignorethedark.com/validation
 * 	 https://github.com/omuryildirim/validation
 */

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 *
   * Validation is jQuery based high compatible tool for checking any validation rule within HTML components.
   * Validation has 33 main validation functions. You can add any function or basicly call
   * any function when creating validation objects.
	 *
	 *
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('body').validation();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').validation( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */

   var validation = function (options) {

	 	this.checkEmpty = function(e, errorKey, elementsObject) {
			var result = true;
					plugin = this;
			$.each(elementsObject, function(elementSelector, i) {
				var element = $(elementSelector),
				 		value = element.val(), //set element value to variable
						removeErrorOnThisEvent = element.is(":checkbox") ? "click":"keypress"; //set event type for removing error

				value = element.is(":checkbox") ? element.is(":checked"):(value != "" && value != null && value != "null" && value.length); //if element is a checkbox, set checkbox checked status,
																																																																			//if element isn't a checkbox, control value if it's empty

				if (!value) {
					result = false;
	        plugin.processError({placeErrorTo: [elementSelector], message: element.data("message") || plugin.errorMessages["notBeEmpty"], errorKey: errorKey});
					element.on(removeErrorOnThisEvent, function() {
						plugin.removeErrorElements([elementSelector], errorKey, "animation-on");
						element.off(removeErrorOnThisEvent);
					});
				}
			});
			return result;
	 	};

		/**
		 * Control inputs with email rules
		 *  @param {event} e
		 *  @param {string} element string in a form of "[data-ue=XX]"
		 *  @returns {boolean} function returns inputs current status as a boolean
		 *    function returns false for two state, first if typed char is not allowed for email input,
		 *    second if input value is not a valid email address.
		 *		if input value is not a valid email adress function looks for data-message tag. if input has
		 *		a data-message tag function will use message string and push a error div next to input.
		 *		if input has not got data-message tag, function auto-use email error message and will push
		 *		error div next to input.
		 */
    this.checkEmail = function(e, errorKey, element) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          email = $(element).val(),
          keychar,
          regEx = /\@|\.|\-|\_/,
          keyCode;

      if (window.event) {
        keyCode = e.keyCode
      } else if (e.which) {
        keyCode = e.which
      }

			if (e.type == "paste") {
			  var data = e.target.value;
			  var response = "";
			  for (var i=0; i<data.length; i++) {
			    var keyCode = data.charCodeAt(i);
			    if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || (keyCode > 47) && (keyCode < 58) || regEx.test(data[i]))
			      response += data[i];
			  }
			  e.target.value = response;
				return true;
			}

      keychar = String.fromCharCode(keyCode);

      switch (keyCode) {
        case null:
        case 8:
        case 9:
        case 32:
          break;
        default:
          if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || (keyCode > 47 && keyCode < 58) || regEx.test(keychar))
            break;
          else
            return false;
          break;
      };


      if (!re.test(email) || email == "" || email == null)
        this.processError({placeErrorTo: [element], message: $(element).data("message") || this.errorMessages["email"], errorKey: errorKey});
      else
				this.removeErrorElements([element], errorKey, "animation-on");
      return true;
    };

		/**
		 * Checks two inputs if they have same value
		 *  @param {event} e
		 *  @param {string} errorKey unique key for defined validation, it makes error handling easier
		 *  @param {string} element string in a form of "[data-ue=XX]"
		 *  @param {string} other string in a form of "[data-ue=XX]"
		 *  @returns {boolean} function returns inputs current status as a boolean
		 *    function always returns true, but it checks if defined inputs have same value,
		 *    if not function creates a error div next to defined inputs
		 *		when creating error div function looks for data-message tag. if input has
		 *		a data-message tag function will use message string and push a error div next to inputs.
		 *		if input has not got data-message tag, function auto-use mustBeSame error message and will push
		 *		error div next to inputs.
		 */
		this.checkIfSame = function(e, errorKey, element, other) {
			var elementValue = $(element).val(),
					otherValue = $(other).val();

			if (elementValue.length) {
				if (otherValue.length) {
					if (elementValue != otherValue) {
		        this.processError({placeErrorTo: [element,other], message: $(element).data("message") || this.errorMessages["mustBeSame"], errorKey: errorKey});
					} else {
						this.removeErrorElements([element,other], errorKey, "animation-on");
					}
				}
			}

			return true;
		};

		/**
		 * Checks two date and decides if dates values have correct differences acording to defined parameters
		 *  @param {event} e
		 *  @param {string} errorKey unique key for defined validation, it makes error handling easier
		 *  @param {string} element string in a form of "[data-ue=XX]"
		 *  @param {object} dateObject has 3 different keys,
		 *		1. otherElement is a string which provides a jQuery selector if both dates will be compared from input's values
		 *		2. checkInput is a boolean which provedes information, "is second date must received from an input?"
		 *		3. limitation is an object which has values which are difference limits between dates.
		 *			 Limitiation object can have a message object to. this message object provides different error messages at different limit errors.
		 *  @returns {boolean} function returns inputs current status as a boolean
		 *    function always returns true, but it checks if given inputs or dates have defined time differece,
		 *    if not function creates a error div next to defined input or inputs
		 *
		 */
	  this.compareDateWithDate = function(e, errorKey, element, dateObject) {
	    var thisSelect = $(element), //set element as a jQuery selector
	        thisDate = new Date(thisSelect.val()), //get input value and convert value to date
					message, //create empty variable
					placeErrorTo = [element]; //set default error place

	    if (dateObject.checkInput) { //if other date must be got from an input
	      dateObject.date = new Date($(dateObject.otherElement).val()); //get input value and convert value to date
				placeErrorTo[1] = dateObject.otherElement; //set other element as an error place
			}

	    var diffindays = Math.floor(dateObject.date.getDate() - thisDate.getDate()); //get day difference between dates

			if (!isNaN(diffindays)) { //if day difference is a valid integer
				var diffinmonths = Math.floor(dateObject.date.getMonth() - thisDate.getMonth()), //get month difference between dates
		     		years = Math.floor(dateObject.date.getFullYear() - thisDate.getFullYear()); //get year difference between dates

		    diffinmonths += (diffindays / 30); //add day difference to month difference
		    years += (diffinmonths / 12); //add month difference to year difference

		    if (dateObject.limitation) { //if any difference limitiations are defined
		      if (!(dateObject.limitation.limitEnd > years)) { //if year difference is bigger than biggest possible difference
		        message = dateObject.limitation.message ? dateObject.limitation.message.limitEnd:"pleaseChooseEarlierDate"; //set defined or default error message
		      } else if (years < dateObject.limitation.limitStart) { //if year difference is lower than lowest possible difference
		        message = dateObject.limitation.message ? dateObject.limitation.message.limitStart:"pleaseChooseLaterDate"; //set defined or default error message
		      }
		    } else if (years < 0 || years > 0) { //if not any difference limitiations are defined and if year difference is different from 0
		      message = dateObject.message || "datesMustBeSame"; //set defined or default error message
		    }

				if (message) //if there is any error message
					this.processError({placeErrorTo: placeErrorTo, message: message, errorKey: errorKey}); //run error processing
				else
					this.removeErrorElements(placeErrorTo, errorKey, "animation-on"); //remove placed errors
			}

	    return true;
	  };

		/**
		 * Checks input value if it's a numeric character
		 *  @param {event} e
		 *  @param {string} errorKey unique key for defined validation, it makes error handling easier
		 *  @param {string} element string in a form of "[data-ue=XX]"
		 *  @returns {boolean} function returns input character status as a boolean
		 *    function checks input value if input character is a numeric character
		 */
		this.numericCheck = function(e, errorKey, element) {
	    var keyCode;
	    if (window.event) {
	      keyCode = e.keyCode
	    } else if (e.which) {
	      keyCode = e.which
	    }

	    if (e.type == "paste") {
	      var data = e.target.value;
	      var response = "";
	      for (var i=0; i<data.length; i++) {
	        var keyCode = data.charCodeAt(i);
	        if ((keyCode > 47) && (keyCode < 58))
	          response += data[i];
	      }
	      e.target.value = response;
				return true;
	    }

	    switch (keyCode) {
	      case 8:
	        return true;
	        break;
	      default:
	        if ((keyCode < 48) || (keyCode > 57))
	          return false;
	        break;
	    }

	    return true;
	  };

		/**
		 * Checks input value if it's a alphabet character
		 *  @param {event} e
		 *  @param {string} errorKey unique key for defined validation, it makes error handling easier
		 *  @param {string} element string in a form of "[data-ue=XX]"
		 *  @returns {boolean} function returns input character status as a boolean
		 *    function checks input value if input character is a alphabet character
		 */
		this.characterCheck = function(e, errorKey, element) {
	    var keyCode,
	     		turkishCharacter = {
			      231: true,
			      305: true,
			      287: true,
			      286: true,
			      199: true,
			      304: true,
			      252: true,
			      220: true,
			      350: true,
			      351: true,
			      214: true,
			      246: true
			    };

	    if (e.type == "paste") {
	      var data = $(e.target).val();
	      var response = "";
	      for (var i=0; i<data.length; i++) {
	        var keyCode = data.charCodeAt(i);
	        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || turkishCharacter[keyCode])
	          response += data[i];
	      }
	      e.target.value = response;
	    }

	    if (window.event) {
	      keyCode = e.keyCode
	    } else if (e.which) {
	      keyCode = e.which
	    }

	    switch (keyCode) {
	      case null:
	      case 8:
	      case 9:
	      case 32:
	        return true;
	        break;
	      default:
	        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || turkishCharacter[keyCode])
	          return true;
	        break;

	    };

	    return false;
	  };

		/**
		 * Creates error alerts with help of error object
		 *  @param {event} e
		 *  @param {string} errorKey unique key for defined validation, it makes error handling easier
		 *  @param {object} elementObject has jQuery selectors as keys and each key has boolean true value,
		 *		example {"[data-ue=XX]": true, "[data-ue=XY]": true}
		 *  @returns {} function returns as boolean.
		 *    first function set elementObject parameters keys to a variable. then loops keys.
		 *    function checks calls each jQeury selectors and look if selected element has error class.
		 *		if any element in elementObject has error class then function returns false, else function returns true
		 */
		this.controlValidationStatus = function(e, errorKey, elementObject) {
			var keys = Object.keys(elementObject);

			for (var i=0; i<keys.length; i++) {
				if ($(keys[i]).is("." + plugin.classNames.errorSelfClass)) {
					return false;
				}
			}

			return true;
		}

		/**
		 * Creates error alerts with help of error object
		 *  @param {object} errorObject has 3 different keys,
		 *		1. errorKey is a string which provides a uniqueness to error messages. it makes easier to find error messages.
		 *		2. placeErrorTo is a array which has node elements. function will place error class to these elements or will place error messages next to these elements.
		 *		3. message is a string which is error message.
		 *  @returns {} function returns undefined.
		 *    first function deletes earlier error messages which has same errorKey.
		 *    after remove chapter function places error divs or classes to defined areas.
		 */
    this.processError = function(errorObject) {


			for (var i=0; i<errorObject.placeErrorTo.length; i++) { //loop error place array
				var errorDiv = document.createElement("div"), //create a element node
						element = $(errorObject.placeErrorTo[i]);

				//$(element)[0].setCustomValidity(errorObject.message);
				//$(element)[0].reportValidity();
				//return true;

				if (!element.parent().children("[data-ue=" + errorObject.errorKey + "]").length) { //if current error key is not used before

					element.addClass(plugin.classNames.errorSelfClass).removeClass(plugin.classNames.successSelfClass); //add to parent .addClass(plugin.classNames.hasError)
					element.parent().children("[data-ue=" + errorObject.errorKey + "]").remove(); //remove if same error exists

		      errorDiv.className = this.classNames.errorDivClass; //set error div's classname
		      errorDiv.innerHTML = errorObject.message;	 //set defined error message as error div's html
					errorDiv.dataset.ue = errorObject.errorKey;  //set unique error key as dataset to errov div

		      element[0].parentNode.insertBefore(errorDiv, element[0].nextSibling); //place error div next to element
					errorDiv.style.height = errorDiv.offsetHeight; //set error div's height to error div's style, this is nessesarry for css based remove animation

					this.processErrorAnimation("add", {elementUK: errorObject.placeErrorTo[i], errorKey: errorObject.errorKey, message: errorObject.message}); //run error placement animation
				}
			}
    };

		/**
		 * Removes error alerts
		 *  @param {string|array} element can be a string in a form of "[data-ue=XX]" or a array which has "[data-ue=XX]" type strings
		 *  @param {string} errorKey string is a unique key for error message
		 *  @param {string} animation string can be "animation-off", "animation-on" or "only-remove"
		 *  @returns {} function returns undefined.
		 *    first function looks if element parameter is an array or not,
		 *    if element parameter is an array, function callbacks itself using array's items.
		 *    after element parameter processing, function applies remove solution which depends animation parameter status.
		 *	@example
		 *		// If function was called with these parameters
		 *		element = ["[data-ue=XX]", "[data-ue=XY]", "[data-ue=YY]"]
		 *		errorKey = "AA"
		 *		animation = "animation-on"
		 *
		 *		//Function will make these callbacs and will remove errors
		 *		_this.removeErrorElements("[data-ue=XX]", "AA", "animation-on")
		 *		_this.removeErrorElements("[data-ue=XY]", "AA", "animation-on")
		 *		_this.removeErrorElements("[data-ue=YY]", "AA", "animation-on")
		 */
		this.removeErrorElements = function(element, errorKey, animation) {
			var _this = this;
			if (typeof element == "object") {
				$.each(element, function(index,elementKey) {
					_this.removeErrorElements(elementKey, errorKey, animation);
				});
				return true;
			}

			var targetElement = $(element),
					errorElement = targetElement.parent().children("[data-ue=" + errorKey + "]");

			if (!targetElement.is("." + _this.classNames.successSelfClass) && errorElement.length) {
				switch (animation) {
					case "animation-off":
						targetElement.removeClass(_this.classNames.errorSelfClass);
						errorElement.remove();
						break;
					case "animation-on":
						targetElement.addClass(_this.classNames.successSelfClass);
						setTimeout(function() {
							if (targetElement.parent().children("." + _this.classNames.errorDivClass).length > 1) {
								targetElement.removeClass(_this.classNames.successSelfClass);
								errorElement.remove();
							} else {
								setTimeout(function() {
									targetElement.removeClass(_this.classNames.errorSelfClass);
									setTimeout(function() {
										targetElement.removeClass(_this.classNames.successSelfClass);
									}, 1000);
									errorElement.remove();
								}, 900);
							}
						}, 100);
						break;
					case "only-remove":
						errorElement.remove();
						break;
				}
			}

			_this.processErrorAnimation("remove", {elementUK: element, errorKey: errorKey});
		};

		/**
		 * Creates animated alerts with current errors
		 *  @param {string} workStatus can be a string in a form of {"add"|"remove"|"process"} this parameters selects which operation will be applied
		 *  @param {object} errorObject has 3 different keys,
		 *		1. elementUK is a string which provides selector of element which has error
		 *		2. errorKey is a string which provides a uniqueness to error messages. it makes easier to find error messages.
		 *		3. message is a string which is error message.
		 *  @returns {} function returns undefined.
		 *    first function selects the operation depending to workStatus parameter,
		 *    1. workStatus = "add".
		 *			If given parentKey and errorKey are used before, function skips "add" operation.
		 *			If given errorObject is not used before, function creates a HTML string depending to errorObject and callbacs this HTML with "process" workStatus
		 *
		 *		2. workStatus = "remove"
		 *			Function removes exect error node collection depending to errorObject.
		 *			After function checks if elements have got any error. If elements haven't got not an error, function deletes all alerts with a removing animation.
		 *
		 *		3. workStatus = "process"
		 *			Function searches error animation.
		 *			If any error animation isn't created or is removing, function creates a new Animated Error and appends it to HTML.
		 *			If an error animation is created and isn't removing, function appends given error HTML to created error animation.
		 *	@example
		 *		// If function was called with these parameters
		 *		workStatus = "add"
		 *		errorObject = {elementUK="[data-ue=XX]", errorKey: YY, message: "Error Message"}
		 *
		 *		//Function will look if given errorObject is not used before, in this case we suppose that given object is not used before
		 *		//Function will create a newErrorHTML variable with value of "<div data-errorid='YY' data-parent='XX' class='each__error' onclick='$('html,body').stop().animate({scrollTop:607});$('[data-ue=XX]').focus();' "
		 *		//Then function will callback itself
		 *		plugin.processErrorAnimation("process", {errorHTML: newErrorHTML, elementUK: errorObject.elementUK});
		 */
		this.processErrorAnimation = function(workStatus, errorObject) {
	    var plugin = this,
					errorDataParent = "data-parent='" + errorObject.elementUK.split("=")[1].replace("]", "") + "'";

	    switch (workStatus) {
	      case "add":
					if (!$("[data-errorid=" + errorObject.errorKey + "][" + errorDataParent + "]").length) {
						var selectedDiv = $(errorObject.elementUK),
 								newErrorHTML = "<div data-errorid='"
																+ errorObject.errorKey
																+ "' "
																+ errorDataParent
																+ " class='"
																+ plugin.classNames.bottomEachErrorClass
																+ "' onclick=\"$(\'html,body\').stop().animate({scrollTop:"
																+ selectedDiv.offset().top + "});$(\'" + (errorObject.elementUK) + "\').focus();\" >"
																+ errorObject.message
	          										+ "</div>";

						plugin.processErrorAnimation("process", {errorHTML: newErrorHTML, elementUK: errorObject.elementUK});
					}
	        break;
				case "remove":
					$("[data-errorid='" + errorObject.errorKey + "'][" + errorDataParent + "]").remove();

					if (!$("[data-errorid]").length) {
			      $("." + plugin.classNames.bottomPageErrorClass + " .inside," + "." + plugin.classNames.topPageErrorClass).addClass("remove");
			      setTimeout(function() {
			        $("." + plugin.classNames.bottomPageErrorClass, "." + plugin.classNames.topPageErrorClass).remove();
			      }, 1200);
					};
					break;
	      case "process":
					var bottomPageErrorDiv = $("." + plugin.classNames.bottomPageErrorClass);
					if (!bottomPageErrorDiv.length || (bottomPageErrorDiv.length == 1 && bottomPageErrorDiv.children(".remove").length)) {
						$("body").prepend("<div class='" + plugin.classNames.topPageErrorClass + "'>"+ this.errorMessages.pageError +"</div>");
						$("body").prepend("<div style='left:" + $(errorObject.elementUK).offset().left + "px' class='" + plugin.classNames.bottomPageErrorClass + "'><div class='inside'><div class='inner'><div class='" + plugin.classNames.errorHeadingClass + "'> " + plugin.errorMessages.pageError +  "</div>" + errorObject.errorHTML + "</div><div class='close'></div></div></div>");

						$("." + plugin.classNames.bottomPageErrorClass + " .close").on("click", function() {
							var bottomPageErrorDivLive = $(this).parents("." + plugin.classNames.bottomPageErrorClass);

				      bottomPageErrorDivLive.children(".inside").addClass("remove");
							$("." + plugin.classNames.topPageErrorClass).addClass("remove");

				      setTimeout(function() {
				        bottomPageErrorDivLive.remove();
								$("." + plugin.classNames.topPageErrorClass).remove();
				      }, 1200);
						});
					} else {
						$("." + plugin.classNames.bottomPageErrorClass + " .inside .inner").append(errorObject.errorHTML);
					}

	        break;
	    }
	  };

		/**
		 * Creates a unique string
		 *  @param {string|node|jQuery} currentElement jQuery selector or node collection to act on or an empty string
		 *  @returns {string} function returns a string which is a uniqueKey value of plugin.
		 *    function looks to currentElement parameter and if it's a node collection function checks if element has a data-ue value.
		 *		if data-ue value is empty, function creates a new uniqueKey and places it to element.
		 *		if data-ue is not empty, function return elements data-ue value.
		 *		if currentElement parameter is undefined or a empty string, function creates a uniqueKey and return this new key as a string.
		 */
		this.createUniqueKey = function(currentElement) {
			if (currentElement && !$(currentElement).data("ue")) {
				this.uniqueKey += 1;
				$(currentElement).attr("data-ue", this.uniqueKey);
				var uniqueElementObject = {};
				uniqueElementObject[this.uniqueKey] = true;
				this.uniqueElementTable = $.extend(this.uniqueElementTable, uniqueElementObject)
			} else if (!currentElement) {
				this.uniqueKey += 1;
			} else {
				return $(currentElement).data("ue");
			}

			return this.uniqueKey;
		};


		/**
		 * Creates Event Handlers with defined validation objects
		 *  @param {array} validationArray an array which has validation objects
		 *  	@example
		 *  	  // A valid validation array must have valid validation object or objects
		 *			// A valid validation object must have 4 different key-value for valid usage, it can have two key-value but they're not mandatory
		 *  	  validationArray = [validationObject];
		 *			validationObject = {
		 *				"event": {string}, *event must be a string within values of DOM events - mandatory
		 *				"element": {string|node|jQuery}, *element will be used as node collection - mandatory
		 *				"function": {string}, *string must be a sub-function name of Validation.js - mandatory
		 *				"parameters": {array} *array must begin with "event" and uniqueKey string //parameters array will pass to validation function - mandatory
		 *				"handlePaste": {boolean} *if validation must be applied on paste event too - not mandatory
		 *				"control": {object} *items which will be controlled if they got error on validaion check - not mandatory
		 *			};
 		 *
		 *  @param {object} emptyObjects list of inputs which can not be empty on defined event
		 *  	@example
		 *			// A valid empty object must have sub objects with jQuery selector as a key and a object as a value.
		 *			// A valid sub-object must have jQuery selector-boolean keys-values.
		 *			emptyObject = {
		 *				"[data-ue=XX]": {
		 *					"[data-ue=XY]": true,
		 *					"[data-ue=YY]": true
	 	 *				},
		 *				"[data-ue=AA]": {
		 *					"[data-ue=BB]": true,
		 *					"[data-ue=CC]": true
	 	 *				}
		 *			};
		 *  @param {object} buttons list of submit buttons which must control form input's error status before submit
		 *  	@example
		 *			// A valid buttons object must have sub objects with jQuery selector as a key and a object as a value.
		 *			// A valid sub-object must have jQuery selector-boolean keys-values.
		 *			buttons = {
		 *				"[data-ue=XX]": {
		 *					"[data-ue=XY]": true,
		 *					"[data-ue=YY]": true
	 	 *				},
		 *				"[data-ue=AA]": {
		 *					"[data-ue=BB]": true,
		 *					"[data-ue=CC]": true
	 	 *				}
		 *			};
		 *  @returns {} function returns undefined.
		 *    function takes emptyObjects, turns emptyObjects to validationObjects and puts created validationObjects to validationArray.
		 *			When turning emptyObjects to validationObjects, function checks if buttons has same keys with emptyObjects keys.
		 *			If it has, than function adds control elements under buttons object as control parameter to created validationObject.
		 *		function takes buttons object, turns buttons to validationObjects and puts created validationObjects to validationArray.
		 *		after setting emptyObjects and buttons object to validationArray, function loops validationArray and creates event handler functions.
		 */
		this.defineValidationHandlers = function (validationArray, emptyObjects, buttons){
			/**
			 * Add check empty functions to validationArray
			 */
			$.each(emptyObjects, function(targetUK, targetObject) {
				validationArray[validationArray.length] = {
					"event": $(targetUK).data("event") || "click",
					"element": targetUK,
					"function": "checkEmpty",
					"parameters": ["event", plugin.createUniqueKey(), targetObject]
				};

				if (buttons[targetUK]) { //if target element must control inputs before handling event
					validationArray[validationArray.length - 1].control = buttons[targetUK]; //create control key for targetObject and set control elements object as value
					delete buttons[targetUK];
				}
			});

			/**
			 * Add button control elements validations to validationArray
			 */
			$.each(buttons, function(targetUK, targetObject) {
				validationArray[validationArray.length] = {
					"event": $(targetUK).data("event") || "click",
					"element": targetUK,
					"function": "controlValidationStatus",
					"parameters": ["event", plugin.createUniqueKey(), targetObject]
				};
			});

			/**
			 * Create event handlers.
 			 * These step will use defined validationArray
			 */
			$.each(validationArray, function(i, validationObject) { //look for validation objects
				var element = $(validationObject.element),
						inlineFunction = element.attr("on" + validationObject.event); //get inline event handler function, {onclick|onkeyup|onkeypress|onkeydown}

				if (inlineFunction) { //if element has an inline event handler
					element.data("on" + validationObject.event, new Function(inlineFunction)) //create a new function from a string and save created function to data-onevent attribute
								 .attr("on" + validationObject.event, null); //set inline event handler to null
				}

				$(document).on(validationObject.event, validationObject.element, function(event) { //Create a event handler
					var result = true;

					validationObject.parameters[0] = event; //Set event to parameters

					if (validationObject.control) //if element must check some inputs if they has error
						result = plugin.controlValidationStatus("", "", validationObject.control); //check if any element has error

					if (plugin[validationObject.function].apply(plugin, validationObject.parameters)) { //Pass parameters to selected validation function and look for return
						if (result && inlineFunction) //if element has a inline event handler function
							$(this).data("on" + validationObject.event)(); //call back inline event handler function
					} else {
						result = false;
					}

					return result;
				});

				if (validationObject.handlePaste) { //if validation must be checked at paste event too
	        $(document).on('paste', validationObject.element, function(event) { //create a paste event handler
				    setTimeout(function() { //wait 50ms, this is nessesarry for value change in event
	          	plugin[validationObject.function](event) //trigger validation
			    	}, 50);
	          return true; //always return true
	        });
				}
			});
		};

		/**
		 * Default Validation.js processing
		 */
    var plugin = this; //set current instance to a variable
    plugin.uniqueKey = parseInt(new Date().getTime() + "000"); //create a unique string with help of date

		var	validationArray = [], //array for gathering together validation informmation objects
				emptyObjects = {}, //object for gathering together elements which will be checked if they are empty on page submit
				buttons = {}; //object for control elements on selected button click

    if (!options) { //if options is empty look for data-validation tag
      $(this).find("[data-validation]").each(function(i, element) { //search for jQuery selectors which have data-validation tag
        var validationType = $(element).data("validation").split(","), //set defined validation type to a variable
						eventType = element.dataset.eventtype; //look for a pre-defined event type

				for (var i=0; i<validationType.length; i++) {
	        switch (validationType[i]) {
						case "empty":
							var targetUK = "[data-ue=" + plugin.createUniqueKey($($(element).data("target"))) + "]", //set node collection which will be compared with selected element
									elementUK = "[data-ue=" + plugin.createUniqueKey(element) + "]",
									elementObject = {};
							elementObject[elementUK] = true;

							emptyObjects[targetUK] = $.extend(emptyObjects[targetUK], elementObject);

							$(element).removeAttr("data-target");
							break;
	          case "email": //define required validationArray for email validation
							var elementUK = "[data-ue=" + plugin.createUniqueKey(element) + "]"; //set a uniqueKey to element
							validationArray[validationArray.length] = {
								"event": eventType || "keypress",
								"element": elementUK,
								"function": "checkEmail",
								"parameters": ["event", plugin.createUniqueKey(), elementUK],
								"handlePaste": true
							};
	            break;
	          case "same":
							var other = $($(element).data("with")), //set jQuery selector which will be compared with selected element
									elementUK = "[data-ue=" + plugin.createUniqueKey(element) + "]", //set a uniqueKey to element and set elementUK variable as a jQuery data call
																																										// @example elementUK = "[data-ue=123123123001]"
									otherUK = "[data-ue=" + plugin.createUniqueKey(other) + "]", //set a uniqueKey to element and set otherUK variable as a jQuery data call
									errorKey = plugin.createUniqueKey(); //create a uniqueKey for error

							for (var c=0; c<2; c++) { //create two different validation objects for two differend node collections
								var first = c ? elementUK:otherUK; //select different node collections for same validation function,
																							 //because same validation function must fire when selected event fired in focus any of these node collections

								validationArray[validationArray.length] = {
									"event": eventType || "keyup",
									"element": first,
									"function": "checkIfSame",
									"parameters": ["event", errorKey, elementUK, otherUK]
								};
							}

							$(element).removeAttr("data-with");
	            break;
	          case "date":
							var other = $($(element).data("with")), //set jQuery selector which will be compared with selected element
									elementUK = "[data-ue=" + plugin.createUniqueKey(element) + "]", //set a uniqueKey to element and set elementUK variable as a jQuery data call
																																										// @example elementUK = "[data-ue=123123123001]"
									otherUK, //create empty variable
									errorKey = plugin.createUniqueKey(), //create a uniqueKey for error
									dateObject = {}, //create empty date object
									count = 1; //create item count integer

							if ($(element).data("limitation")) { //if node collection has a setted limitation data, put this data to date object
								dateObject.limitation = $(element).data("limitation");
								$(element).removeAttr("data-limitation");
							}

							if (other.length) { //if node cellection has a setted with data, use setted data as jQuery selector and set this selectors informations to dateObject
								otherUK = "[data-ue=" + plugin.createUniqueKey(other) + "]"; //set a uniqueKey to element and set otherUK variable as a jQuery data call
								dateObject.checkInput = true; //set checkInput value true if element input's value will be compared with other element's value
								dateObject.otherElement = otherUK; //set other element's unique key to date object
								count = 2;
								$(element).removeAttr("data-with");
							} else {
								dateObject.checkInput = false; //set checkInput value false if element input's value will be compared with a date
								dateObject.date = $(element).data("date") ? new Date($(element).data("date")):new Date();  //set date value to date object, if element hasn't got a defined date data use empty string as a default
							}

							for (var c=0; c<count; c++) { //create two different validation objects for two differend node collections
								var first = c ? otherUK:elementUK; //select different node collections for same validation function,
																							 //because same validation function must fire when selected event fired in focus any of these node collections

								validationArray[validationArray.length] = {
									"event": eventType || "change",
									"element": first,
									"function": "compareDateWithDate",
									"parameters": ["event", errorKey, elementUK, dateObject]
								};
							};
	            break;
						case "numeric": //set required validation object to validationArray for numeric character check
							var elementUK = "[data-ue=" + plugin.createUniqueKey(element) + "]"; //set a uniqueKey to element
							validationArray[validationArray.length] = {
								"event": eventType || "keypress",
								"element": elementUK,
								"function": "numericCheck",
								"parameters": ["event", plugin.createUniqueKey(), elementUK],
								"handlePaste": true
							};
							break;
						case "character": //set required validation object to validationArray for alphabet character check
							var elementUK = "[data-ue=" + plugin.createUniqueKey(element) + "]"; //set a uniqueKey to element
							validationArray[validationArray.length] = {
								"event": eventType || "keypress",
								"element": elementUK,
								"function": "characterCheck",
								"parameters": ["event", plugin.createUniqueKey(), elementUK],
								"handlePaste": true
							};
							break;
	        }
				}

				if ($(element).data("control")) { //if element's current validation status must effect a target, target is usally a button which submits form
					var targetUK = "[data-ue=" + plugin.createUniqueKey($($(element).data("control"))) + "]", //set jQuery selector of target
							elementObject = {};

					elementObject[elementUK] = true;
					buttons[targetUK] = $.extend(buttons[targetUK], elementObject);

					$(element).removeAttr("data-control");
				}

				$(element).removeAttr("data-validation");
      });
    } else if(this.is("form")) {
			var formUK = "[data-ue=" + plugin.createUniqueKey(this.find(":submit")) + "]";

			$.each(options, function(option, elementsObject) {
				switch (option) {
					case "empty":
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]",
									elementObject = {};
							elementObject[elementUK] = true;

							emptyObjects[formUK] = $.extend(emptyObjects[formUK], elementObject);

							if (validationDetails.message)
								$(elementUK).data("message", validationDetails.message);
						});
						break;
					case "email": //define required validationArray for email validation
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]"; //set a uniqueKey to element
							validationArray[validationArray.length] = {
								"event": validationDetails.eventType || "keypress",
								"element": elementUK,
								"function": "checkEmail",
								"parameters": ["event", plugin.createUniqueKey(), elementUK],
								"handlePaste": true
							};

							if (validationDetails.message)
								$(elementUK).data("message", validationDetails.message);
						});
						break;
					case "same":
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]", //set a uniqueKey to element and set elementUK variable as a jQuery data call
																																													// @example elementUK = "[data-ue=123123123001]"
									otherUK = "[data-ue=" + plugin.createUniqueKey($(validationDetails.other)) + "]", //set a uniqueKey to element and set otherUK variable as a jQuery data call
									errorKey = plugin.createUniqueKey(); //create a uniqueKey for error

							for (var c=0; c<2; c++) { //create two different validation objects for two differend node collections
								var first = c ? elementUK:otherUK; //select different node collections for same validation function,
																							 //because same validation function must fire when selected event fired in focus any of these node collections

								validationArray[validationArray.length] = {
									"event": validationDetails.eventType || "keyup",
									"element": first,
									"function": "checkIfSame",
									"parameters": ["event", errorKey, elementUK, otherUK]
								};
							}

							if (validationDetails.message)
								$(elementUK).data("message", validationDetails.message);
						});
						break;
					case "date":
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var other = validationDetails.other, //set jQuery selector which will be compared with selected element
									elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]", //set a uniqueKey to element and set elementUK variable as a jQuery data call
																																													// @example elementUK = "[data-ue=123123123001]"
									otherUK, //create empty variable
									errorKey = plugin.createUniqueKey(), //create a uniqueKey for error
									dateObject = {}, //create empty date object
									count = 1; //create item count integer

							if (validationDetails.limitation) //if node collection has a setted limitation data, put this data to date object
								dateObject.limitation = validationDetails.limitation;

							if (other.length) { //if node cellection has a setted with data, use setted data as jQuery selector and set this selectors informations to dateObject
								otherUK = "[data-ue=" + plugin.createUniqueKey(other) + "]"; //set a uniqueKey to element and set otherUK variable as a jQuery data call
								dateObject.checkInput = true; //set checkInput value true if element input's value will be compared with other element's value
								dateObject.otherElement = otherUK; //set other element's unique key to date object
								count = 2;
							} else {
								dateObject.checkInput = false; //set checkInput value false if element input's value will be compared with a date
								dateObject.date = $(element).data("date") ? new Date($(element).data("date")):new Date(); //set date value to date object, if element hasn't got a defined date data use empty string as a default
							}

							for (var c=0; c<count; c++) { //create two different validation objects for two differend node collections
								var first = c ? otherUK:elementUK; //select different node collections for same validation function,
																							 //because same validation function must fire when selected event fired in focus any of these node collections

								validationArray[validationArray.length] = {
									"event": validationDetails.eventType || "change",
									"element": first,
									"function": "compareDateWithDate",
									"parameters": ["event", errorKey, elementUK, dateObject]
								};
							};

							if (validationDetails.message)
								$(elementUK).data("message", validationDetails.message);
						});
						break;
					case "numeric":
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]"; //set a uniqueKey to element
							validationArray[validationArray.length] = {
								"event": validationDetails.eventType || "keypress",
								"element": elementUK,
								"function": "numericCheck",
								"parameters": ["event", plugin.createUniqueKey(), elementUK],
								"handlePaste": true
							};

							if (validationDetails.message)
								$(elementUK).data("message", validationDetails.message);
						});
						break;
					case "character":
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]"; //set a uniqueKey to element
							validationArray[validationArray.length] = {
								"event": validationDetails.eventType || "keypress",
								"element": elementUK,
								"function": "characterCheck",
								"parameters": ["event", plugin.createUniqueKey(), elementUK],
								"handlePaste": true
							};

							if (validationDetails.message)
								$(elementUK).data("message", validationDetails.message);
						});
						break;
					case "control":
						$.each(elementsObject, function(elementSelector, validationDetails) {
							var elementObject = {},
									elementUK = "[data-ue=" + plugin.createUniqueKey(elementSelector) + "]"

							elementObject[elementUK] = true;
							buttons[formUK] = $.extend(buttons[formUK], elementObject);
						});
						break;
				}
			});
		}

		this.defineValidationHandlers(validationArray, emptyObjects, buttons);

		/**
		 * Defined class names for further usage.
		 */
    this.classNames = {
      "errorDivClass": "input-error",
      "errorSelfClass": "input__error",
      "hasError": "has__error",
      "errorCheckbox": "e__checkbox",
      "errorRadio": "e__radio",
      "errorGeneral": "general",
      "errorWithPadding": "with__padding",
      "errorSuccess": "error__success",
      "successSelfClass": "input__success",
      "errorHeadingClass": "error__heading",
      "bottomPageErrorClass": "page__error__bottom",
      "bottomEachErrorClass": "each__error",
      "topPageErrorClass": "page__error__top"
    };

		/**
		 * Defined error messages for further usage.
		 */
		this.errorMessages = {
	    notBeEmpty: " can not be empty!",
	    pageError: "Please check errors.",
	    mustBeSame: "These inputs must have same values!",
	    datesMustBeSame: "Dates must be same!",
			email: "Please type a correct email adress!"
	  };
  }

	$.fn.validation = validation;
}));
