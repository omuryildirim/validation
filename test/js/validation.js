/*
    Validation is jQuery based high compatible tool for checking any validation rule within HTML components.
    Validation has 33 main validation functions. You can add any function or basicly call
    any function when creating validation objects.

    * v2.3.4 - Realese 08/24/2016
    * Open Source, Free for all usage

    * from .. .. . . .
*/
var validator = function(e) {
  $(this.classNames.errorDivClass).remove();
};

validator.prototype = {
  searchObj: {
    main: {
      html: {
        label: {
          rule: "*",
          parentTag: ".input__parent",
          type: "Label",
          message: "notBeEmpty",
          showLabel: true,
          visibility: true
        }
      }
    }
  },
  addSearchObject: function(tag, searchObject) {
    var plugin = this;
    if (typeof tag == "object") {
      $.each(tag, function(index,value) {
        plugin.searchObj[value] = searchObject;
      })
    } else
      plugin.searchObj[tag] = searchObject;
  },
  addValidationObject: function(tag, validationObject) {
    var plugin = this;
    if (typeof tag == "object") {
      $.each(tag, function(index,value) {
        plugin.processObject(["validationObj", value], validationObject)
      })
    } else
      plugin.processObject(["validationObj", tag], validationObject)
  },
  validate: function(eventType, tag, workType, returnFunction) {
    var plugin = this;
    plugin.uniqueKey = parseInt(new Date().getTime() + "000");
    plugin.validationObj = plugin.validationObj || {};

    if (typeof tag == "object") {
      $.each(tag, function(index,value) {
  	    if (typeof plugin.validationObj[value] == "object")
  	      plugin.keypressValidation(plugin.validationObj[value]);
      });
  	} else if (typeof plugin.validationObj[tag] == "object")
          plugin.keypressValidation(plugin.validationObj[tag]);

    if (plugin.initObject)
      plugin.initCheck(plugin.initObject);

    if (typeof tag == "object") {
      $.each(tag, function(index,value) {
        if ($(value).attr("onclick")) {
          $(value).data("onclick", $(value).attr("onclick").replace("return false", ""));
          $(value).attr("onclick", null);
        };
        $(document).on(eventType, value, function(event) {
          var result = plugin.checkFilled(plugin.searchObj[value], workType) && !$("[data-haserror='true']").length;
          if (result) {
            if(returnFunction)
              eval(returnFunction);
            if ($(this).data("onclick")) {
         	  	 event.preventDefault();
               eval($(this).data("onclick"));
            }
          }
          return result;
        });
      });
    } else {
      if ($(tag).attr("onclick")) {
        $(tag).data("onclick", $(tag).attr("onclick").replace("return false", ""));
        $(tag)[0].onclick = null;
      };
      $(document).on(eventType, tag, function(event) {
        var searchResult = plugin.checkFilled(plugin.searchObj[tag], workType);
        var result = searchResult && !$("[data-haserror='true']").length;
        if (result) {
          if(returnFunction)
            eval(returnFunction);
          if ($(this).data("onclick")) {
       	  	 event.preventDefault();
             eval($(this).data("onclick"));
          }
        } else if (searchResult) {
          $("html,body").stop().animate({scrollTop: $("[data-haserror='true']").offset().top - 20});
        }

        return result;
      });
    }
  },
  checkFilled: function(searchObject, workType) {
    var plugin = this;
    var mainResult = true;
    if (workType == "main")
      if (typeof searchObject == "object")
        mainResult = plugin.checkFilled(plugin.searchObj["main"], "not-process-errors");
      else
        mainResult = plugin.checkFilled(plugin.searchObj["main"]);
    if (typeof searchObject == "undefined")
      return mainResult;
    $.each(searchObject, function(type, tagObject) {
      switch (type) {
        case "html":
          $.each(tagObject, function(tag, propertiesObject) {
            var rule = new RegExp(".[" + propertiesObject.rule + "]");
            $.each($(tag), function(e, f) {
              var currentElement = $(f).parents(propertiesObject.parentTag).find(".selectized").length ? $(f).parents(propertiesObject.parentTag).find("select")[0]: $(f).parents(propertiesObject.parentTag).find("input,select,textarea")[0];
              if (propertiesObject.visibility)
                if (!plugin.checkVisibility(currentElement))
                  return true;
              var key = plugin.createUniqueKey(currentElement);
              if (rule.test(f.innerHTML) && !plugin.checkEmpty(currentElement))
                plugin.processErrorObject([key, key, propertiesObject]);
            });
          });
          break;
        case "checkbox":
          $.each(tagObject, function (tag, propertiesObject) {
            var key = plugin.createUniqueKey(tag);
            if (!plugin.checkCB(tag))
              plugin.processErrorObject([key, key, propertiesObject]);
          });
          break;

        case "empty":
          $.each(tagObject, function(tag, propertiesObject) {
            if (propertiesObject.elemets) {
              $.each(propertiesObject.elemets, function(index,value) {
                  var currentElement = $(value)[0];
                  if (propertiesObject.visibility)
                    if (!plugin.checkVisibility(currentElement))
                      return true;
                  var key = plugin.createUniqueKey(currentElement);
                  if (!plugin.checkEmpty(currentElement)) {
                    var newPropertiesObject = $.extend({}, propertiesObject);
                    if (newPropertiesObject.messageType == "List") newPropertiesObject.currentIndex = index;
                    plugin.processErrorObject([key, key, newPropertiesObject]);
                  }
              });
            }
            else {
              var currentElement = $(tag);
              if (propertiesObject.visibility)
                if (!plugin.checkVisibility(currentElement))
                  return true;
              var key = plugin.createUniqueKey(currentElement);
              if (!plugin.checkEmpty(currentElement))
                plugin.processErrorObject([key, key, propertiesObject]);
            }
          });

      };
    });

    if (typeof plugin.errorObject == "object" && plugin.errorObject.length && workType != "not-process-errors")
        plugin.processErrors("", "click", "searchObject");
    else
      return mainResult;

    return false;
  },
  keypressValidation: function(validationObj) {
    var plugin = this;
    $.each(validationObj, function(type, tagObject) {
      var eventType = type;
      $.each(tagObject, function(tag, propertiesObject) {
        propertiesObject.uniqueKey = plugin.createUniqueKey();
        plugin.processObject(["uniqueErrorTable", propertiesObject.uniqueKey], {});
        if (propertiesObject.ruleObject) {
          $(document).on(eventType, tag, function(e) {
            var thisElement = this;
            $.each(propertiesObject.ruleObject, function(index, eachRuleObject) {

              if ((eachRuleObject.visibility && !plugin.checkVisibility(thisElement)))
                return false;
              else if ($(thisElement).val() == '' && eventType != "click") {
                plugin.selfErrorObject = [plugin.createUniqueKey(thisElement)];
                plugin.processErrors("Nothing");
                return true;
              }

              var uniqueKey = plugin.createUniqueKey(thisElement),
                  result = eachRuleObject.rule(eachRuleObject, plugin, uniqueKey),
                  submitObject = $.extend({}, eachRuleObject, true);

              var element = $(thisElement);
              if (result[1]) {
                if (result[1].message) submitObject.message = result[1].message;
                if (result[1].parentTag) submitObject.parentTag = result[1].parentTag;
                if (result[1].type) submitObject.type = result[1].type;
                if (result[1].placeErrorTo) element = $(result[1].placeErrorTo);

                if (!result[0]) {
                  $.each(element, function(index,item) {
                    var elementKey = plugin.createUniqueKey($(item).attr("data-haserror", true));
                    plugin.processErrorObject([elementKey, propertiesObject.uniqueKey, submitObject]);
                  });
                  plugin.processErrors("", eventType, "validationError");
                } else if ($("[data-uniqueerror='" + propertiesObject.uniqueKey + "']").length) {
                  $.each(plugin.uniqueErrorTable[propertiesObject.uniqueKey], function(index,item) {
                    $("[data-uniqueelement='" + index + "']").attr("data-haserror", false);
                    plugin.removeErrorElements(index, plugin.uniqueErrorTable[propertiesObject.uniqueKey][index], propertiesObject.uniqueKey, "animation-on");
                    plugin.updateBottomError(propertiesObject.uniqueKey);
                  });
                }
              }
              else {
                plugin.selfErrorObject = [uniqueKey];
                switch (result[0]) {
                  case "nothing":
                    plugin.processErrors("Nothing");
                    break;
                  case false:
                    plugin.processErrors("Add Self Class");
                    break;
                  case true:
                    plugin.processErrors("Remove Self Class");
                    break;
                }
              }

              if (propertiesObject.withReturn) {
                propertiesObject.result = result[0];
                return false;
              }
            });

            if (propertiesObject.withReturn)
              return propertiesObject.result;

          });
        } else {
          $(document).on(eventType, tag, function(e) {
            var element = $(this);

            if ((propertiesObject.visibility && !plugin.checkVisibility(this)))
              return false;
            else if (element.val() == '' && eventType != "click") {
              plugin.selfErrorObject = [plugin.createUniqueKey(this)];
              plugin.processErrors("Nothing");
              return true;
            }

            var uniqueKey = plugin.createUniqueKey(this),
                result = propertiesObject.rule(propertiesObject, plugin, uniqueKey),
                submitObject = $.extend({}, propertiesObject, true);

            if (result[1]) {
              if (result[1].message) submitObject.message = result[1].message;
              if (result[1].parentTag) submitObject.parentTag = result[1].parentTag;
              if (result[1].type) submitObject.type = result[1].type;
              if (result[1].placeErrorTo) element = $(result[1].placeErrorTo);

              if (!result[0]) {
                $.each(element, function(index,item) {
                  var elementKey = plugin.createUniqueKey($(item).attr("data-haserror", true));
                  plugin.processErrorObject([elementKey, propertiesObject.uniqueKey, submitObject]);
                });
                plugin.processErrors("", eventType, "validationError");
              } else if ($("[data-uniqueerror='" + propertiesObject.uniqueKey + "']").length) {
                $.each(plugin.uniqueErrorTable[propertiesObject.uniqueKey], function(index,item) {
                  $("[data-uniqueelement='" + index + "']").attr("data-haserror", false);
                  plugin.removeErrorElements(index, plugin.uniqueErrorTable[propertiesObject.uniqueKey][index], propertiesObject.uniqueKey, "animation-on");
                  plugin.updateBottomError(propertiesObject.uniqueKey);
                });
              }
            }
            else {
              plugin.selfErrorObject = [uniqueKey];
              switch (result[0]) {
                case "nothing":
                  plugin.processErrors("Nothing");
                  break;
                case false:
                  plugin.processErrors("Add Self Class");
                  break;
                case true:
                  plugin.processErrors("Remove Self Class");
                  break;
              }
            }
          });
        }
      });
    });
  },
  checkEmpty: function(tag) {
    var value = $(tag).val();
    return (value != "" && value != null && value != "null" && value.length);
  },
  checkCB: function(tag) {
    var plugin = this,
        result = true;
    if (!$(tag).prop("checked") && $(tag).is(":visible")) {
      result = false;
    }
    return result;
  },
  checkVisibility: function(tag) {
    return $(tag).is(":visible") ? true : $(tag).is("select") && $(tag).parent().is(":visible");
  },
  processErrorObject: function(errorArray) {
      if (this.errorObject)
        this.errorObject[this.errorObject.length] = errorArray;
      else {
        this.errorObject = [];
        this.errorObject[this.errorObject.length] = errorArray;
      }
  },
  processObject: function(names, value, action) {
    if (action == "remove")
      switch (names.length) {
        case 0:
          if (this[names[0]])
            delete this[names[0]];
          return;
          break;
        case 1:
          if (this[names[0]][names[1]])
            delete this[names[0]][names[1]];
          return;
          break;
        case 2:
          if (this[names[0]][names[1]][names[2]])
            delete this[names[0]][names[1]][names[2]];
          return;
          break;
      }

    for (var i=0;i<names.length;i++) {
      switch (i) {
        case 0:
          if (names.length == 1) {
            this[names[0]] = value;
          } else {
            this[names[0]] = this[names[0]] || {};
          }
          break;
        case 1:
          if (names.length == 2) {
            this[names[0]][names[1]] = value;
          } else {
            this[names[0]][names[1]] = this[names[0]][names[1]] || {};
          }
          break;
        case 2:
          if (names.length == 3) {
            this[names[0]][names[1]][names[2]] = value;
          } else {
            this[names[0]][names[1]][names[2]] = this[names[0]][names[1]][names[2]] || {};
          }
          break;
      }
    }
  },
  processErrors: function(processType, eventType, errorType) {
    var plugin = this;
    switch (processType) {
      default:
        var newObject = plugin.errorObject.slice(),
            sliced = 0;
        $.each(plugin.errorObject, function(index, elementArray) {
          if (elementArray) {
            if (plugin.errorMessages[elementArray[2].message])
              elementArray[2].message = plugin.errorMessages[elementArray[2].message];

            var targetElement = $("[data-uniqueelement='" + elementArray[0] + "']").parents(elementArray[2].parentTag),
                parentKey = plugin.createUniqueKey(targetElement[0]);

            plugin.processObject(["uniqueElementTable", elementArray[0], elementArray[1]], parentKey);
            plugin.processObject(["uniqueErrorTable", elementArray[1], elementArray[0]], parentKey);

            if (elementArray[2].messageType == "List")
              var errorDiv = plugin.createErrorDiv(elementArray[2].type || "Rule", elementArray[2].showLabel, elementArray[2].messages[elementArray[2].currentIndex], parentKey, elementArray[1]);
            else
              var errorDiv = plugin.createErrorDiv(elementArray[2].type || "Rule", elementArray[2].showLabel, elementArray[2].message, parentKey, elementArray[1]);

            if ($("[data-uniqueelement='" + parentKey + "'] [data-uniqueerror='" + elementArray[1] + "']").length)
              plugin.removeErrorElements(elementArray[0], parentKey, elementArray[1], "animation-off");

            targetElement.addClass(plugin.classNames.hasError).append(errorDiv.addClass(errorType));
            errorDiv.height(errorDiv.height());

            if (eventType == "click") {
              plugin.changeRemover(elementArray[0], parentKey, elementArray[1]);
              plugin.processErrorAnimation("add", elementArray, parentKey);
            }

            newObject.splice(index-sliced, 1);
            sliced += 1;
          }
        });
        plugin.errorObject = newObject;
        if (plugin.pageErrorHTML)
          plugin.processErrorAnimation("process");

        break;
      case "Add Self Class":
        var element = $("[data-uniqueelement='" + plugin.selfErrorObject[0] + "']").addClass(plugin.classNames.errorSelfClass).removeClass(plugin.classNames.successSelfClass).attr("data-haserror", true);
        if (!$("[data-uniqueerror='" + plugin.selfErrorObject[0] + "']").length) {
          var newError = $("<div/>", {"class": "error__char", "data-uniqueerror": plugin.selfErrorObject[0]});
          $(element).after(newError).parent().css("position", "relative");
          var parentPadding = parseInt(newError.parent().css("padding-right"));
          if (parentPadding) newError.css("right", parentPadding + 8);
        }
        else $("[data-uniqueerror='" + plugin.selfErrorObject[0] + "']").removeClass("success");
        delete plugin.selfErrorObject;
        break;
      case "Remove Self Class":
        $("[data-uniqueelement='" + plugin.selfErrorObject[0] + "']").removeClass(plugin.classNames.errorSelfClass).addClass(plugin.classNames.successSelfClass).attr("data-haserror", false);
        $("[data-uniqueerror='" + plugin.selfErrorObject[0] + "']").addClass("success");
        delete plugin.selfErrorObject;
        break;
      case "Nothing":
        $("[data-uniqueelement='" + plugin.selfErrorObject[0] + "']").removeClass(plugin.classNames.errorSelfClass).removeClass(plugin.classNames.successSelfClass).attr("data-haserror", false);
        delete plugin.selfErrorObject;
        break;
    }
  },
  createErrorDiv: function(type, showLabel, message, parentKey, uniqueKey) {
    var errorDiv = $("<div/>", {"class": this.classNames.errorDivClass, "data-uniqueerror": uniqueKey});

    switch (type) {
      case "Label":
        if (showLabel)
          errorDiv = errorDiv.append($("[data-uniqueelement='" + parentKey + "']").find("label")[0].innerHTML + message);
        else
          errorDiv = errorDiv.append(message);
        break;

      case "Rule":
        errorDiv = errorDiv.append(message);
        break;

      case "Checkbox":
        errorDiv = errorDiv.addClass(this.classNames.errorCheckbox);
        break;

      case "Radio":
        errorDiv = errorDiv.addClass(this.classNames.errorRadio),errorDiv.append(message);
        break;

      case "General":
        errorDiv = errorDiv.addClass(this.classNames.errorGeneral),errorDiv.append(message);
        break;

      case "HasError":
        errorDiv = errorDiv.addClass(this.classNames.errorGeneral),errorDiv.append(message);
        break;

      case "With Padding":
        errorDiv = errorDiv.addClass(this.classNames.errorWithPadding),errorDiv.append(message);
        break;
    }
    return errorDiv;
  },
  createUniqueKey: function(currentElement) {
    if (currentElement && !$(currentElement).data("uniqueelement")) {
      this.uniqueKey += 1;
      $(currentElement).attr("data-uniqueelement", this.uniqueKey);
    } else if (!currentElement) {
      this.uniqueKey += 1;
    } else {
      return $(currentElement).data("uniqueelement");
    }

    return this.uniqueKey;
  },
  changeRemover: function(uniqueKey, parentKey, errorKey) {
    var _this = this,
        currentElement = $("[data-uniqueelement='" + uniqueKey + "']"),
        select = currentElement.is("select"),
        checkbox = currentElement.is("[type='checkbox']"),
        radio = currentElement.is(".div-radio"),
        expire = currentElement.is("[name^=\"expiry\"]"),
        id = "#" + currentElement.attr("id") || "." + currentElement.attr("class"),
        date = currentElement.attr("format");

    if (checkbox || date)
      $(document).on("change", id, function() {
        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length)
        _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on"),_this.updateBottomError(errorKey);
      });
    else if (expire)
      $(document).on("change", id, function() {
        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(this).val() != "")
          _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on"),_this.updateBottomError(errorKey);
      });
    else if (select)
	    if ($(id).is("[id^='bday']")) {
	      $(document).on("change", id, function(e) {
	        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(e.target).val() != "")
	          _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on"),_this.updateBottomError(errorKey);
	      });
	      $(document).on("change", "#" + $(el).parents(elementObject[1].parentTag).next().find("select").attr("id"), function(e) {
	        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(e.target).val() != "")
	          _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on");
	      });
	      $(document).on("change", "#" + $(el).parents(elementObject[1].parentTag).next().next().find("select").attr("id"), function(e) {
	        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(e.target).val() != "")
	          _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on");
	      });
	    } else
	      $(document).on("change", id, function(e) {
	        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(e.target).val() != "")
	          _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on"),_this.updateBottomError(errorKey);
	      });
    else if (radio) {
      $(document).on("click", ".select__fare", function() {
        if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(this).children(".div-radio").length)
          _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on"),_this.updateBottomError(errorKey);
      });
    }
    else
	    $(document).on("keyup", id, function() {
	      if ($(".searchObject[data-uniqueerror='" + errorKey + "']").length && $(this).val() != "")
	        _this.removeErrorElements(uniqueKey, parentKey, errorKey, "animation-on"),_this.updateBottomError(errorKey);
	    });
  },
  removeErrorElements: function(uniqueKey, parentKey, errorKey, animation) {
    _this = this;
    if (typeof uniqueKey == "object") {
      $.each(uniqueKey, function(index,key) {
        _this.removeErrorElements(key, errorKey, animation);
      });
      return true;
    }

    _this.processObject(["uniqueElementTable", uniqueKey, errorKey], parentKey, "remove");
    _this.processObject(["uniqueErrorTable", errorKey, uniqueKey], parentKey, "remove");
    var targetElement = $("[data-uniqueelement='" + parentKey + "']"),
        errorElement = "[data-uniqueelement='" + parentKey + "'] [data-uniqueerror='" + errorKey + "']";

    if (targetElement.find("div[data-uniqueerror]").length > 1)
      animation = "only-remove";

    if (!targetElement.is("." + _this.classNames.errorSuccess)) {
      switch (animation) {
        case "animation-off":
          targetElement.removeClass(_this.classNames.hasError);
          $(errorElement).remove();
          break;
        case "animation-on":
          targetElement.addClass(_this.classNames.errorSuccess);
          setTimeout(function() {
            targetElement.removeClass(_this.classNames.hasError);
            $(errorElement).remove();
          }, 1000);
          setTimeout(function() {
            targetElement.removeClass(_this.classNames.errorSuccess);
          }, 2000);
          break;
        case "only-remove":
        $(errorElement).remove();
          break;
      }
    }
  },
  updateBottomError: function(uniqueKey) {
      $("[data-errorid='" + uniqueKey + "']").remove();
      if (!$("." + this.classNames.bottomPageErrorClass + " ." + this.classNames.bottomEachErrorClass).length)
        this.deleteErrorPage();
  },
  processErrorAnimation: function(workStatus, errorObject, parentKey) {
    var plugin = this;
    switch (workStatus) {
      case "add":
        var selectedDiv = $("[data-uniqueelement='" + errorObject[0] + "']");
        plugin.pageErrorParent = $("[data-uniqueelement='" + parentKey + "']");
        if (selectedDiv.is("select")) {
          plugin.pageErrorHTML += "<div data-errorid=\'" + (errorObject[1]) + "\' class='" + plugin.classNames.bottomEachErrorClass +
           "' onclick='$(\"html,body\").stop().animate({scrollTop:" + plugin.pageErrorParent.offset().top + "});$(\"[data-uniqueelement=" + errorObject[0] + "]\").next(\".selectize-control\").children(\".selectize-input\").trigger(\"click\");' >";
          plugin.pageErrorHTML += errorObject[2].messages ? errorObject[2].messages[errorObject[2].currentIndex] : errorObject[2].showLabel ? plugin.pageErrorParent.find("label").text() + " " + errorObject[2].message : errorObject[2].message || plugin.pageErrorParent.find("label").text();
          plugin.pageErrorHTML += "</div>";
        } else {
          plugin.pageErrorHTML += "<div data-errorid='" + (errorObject[1]) + "' class='" + plugin.classNames.bottomEachErrorClass +
           "' onclick='$(\"html,body\").stop().animate({scrollTop:" + plugin.pageErrorParent.offset().top + "});$(\"[data-uniqueelement=" + errorObject[0] + "]\").focus();' >";
          plugin.pageErrorHTML += errorObject[2].messages ? errorObject[2].messages[errorObject[2].currentIndex] : errorObject[2].showLabel ? plugin.pageErrorParent.find("label").text() + " " + errorObject[2].message : errorObject[2].message || plugin.pageErrorParent.find("label").text();
          plugin.pageErrorHTML += "</div>";
        }
        break;
      case "process":
        $("." + plugin.classNames.topPageErrorClass + "," + "." + plugin.classNames.bottomPageErrorClass).remove();
        $("body").prepend("<div class='" + plugin.classNames.topPageErrorClass + "'>"+ this.errorMessages.pageError +"</div>");
        $("body").prepend("<div style='left:" + plugin.pageErrorParent.offset().left + "px' class='" + plugin.classNames.bottomPageErrorClass + "'><div class='inside'><div class='inner'><div class='" + plugin.classNames.errorHeadingClass + "'> " + this.errorMessages.pageError +  "</div>" + plugin.pageErrorHTML + "</div><div class='close'></div></div></div>");
        $("." + plugin.classNames.bottomPageErrorClass + " .close").on("click", function() {
          plugin.deleteErrorPage();
        });
        plugin.pageErrorHTML = "";
        break;
    }
  },
  deleteErrorPage: function() {
      var plugin = this;
      $("." + plugin.classNames.bottomPageErrorClass + " .inside").addClass("remove");
      setTimeout(function() {
        $("." + plugin.classNames.bottomPageErrorClass).remove();
      }, 1200);
  },
  checkEmail: function(propertiesObject, plugin, uniqueKey) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        result = [true];
    if (propertiesObject.message) {
      result[1] = {placeErrorTo: ["[data-uniqueelement='" + uniqueKey + "']"], message: propertiesObject.message};
    }
    var email = $("[data-uniqueelement='" + uniqueKey + "']").val();
    if (!re.test(email) || email == "" || email == null) {
      result[0] = false;
      return result;
    }
    return result;
  },
  checkPhone: function(propertiesObject, plugin, uniqueKey) {
    var result = [true];

    var element = $("[data-uniqueelement='" + uniqueKey + "']");
    var elementValue = element.val();


    if (elementValue.length < 5 || (elementValue.length < 6 && /\ /g.test(elementValue[elementValue.length-1])) || (!/\+/g.test(elementValue) && !elementValue.length))
      return ["nothing"];

    if (!element.intlTelInput("isValidNumber")) {
      switch (element.intlTelInput("getValidationError")) {

        case intlTelInputUtils.validationError.TOO_SHORT:
          result = [false];
          break;

        case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
          result = [false];
          break;

        case intlTelInputUtils.validationError.TOO_LONG:
          result = [false];
          break;

        default:
          result = [false];
          break;

      }
    }

    return result;
  },
  checkCounts: function(propertiesObject, plugin, uniqueKey) {
    var adult = propertiesObject.elements[0],
      child = propertiesObject.elements[1],
      infant = propertiesObject.elements[2];

    var result = [true, propertiesObject.elements[0]];
    //Create variables for passenger object

    var totalAdultCount = parseInt($(adult).val());

    var totalChildCount = parseInt($(child).val());

    var totalInfantCount = parseInt($(infant).val());

    /*Add Conditional Discount Values*/
    $("div[data-code]:visible select").each(function() {
      totalAdultCount += parseInt(this.value || 0);
    });

    var totalSeatCount = (totalAdultCount + totalChildCount);

    if (totalAdultCount < totalInfantCount)
      result = [false, {placeErrorTo: [adult, infant], message: infCantGreater}];
    else if (totalAdultCount == 0 && totalChildCount > 0)
      result = [false, {placeErrorTo: [adult, infant], message: withoutParents}];
    else if (totalSeatCount > maxPassengerCount)
      result = [false, {placeErrorTo: [adult, infant, child], message: maxPassengerError}];
    else if (totalSeatCount == 0)
      result = [false, {placeErrorTo: [adult, infant, child], message: leastOnePassenger}];

    return result;

  },
  checkDate: function(date1, date2, kind) {
    var diff = Math.floor(date1.getTime() - date2.getTime()),
        diffindays = Math.floor(date1.getDate() - date2.getDate()),
        years = Math.floor(date1.getFullYear() - date2.getFullYear()),
        diffinmonths = Math.floor(date1.getMonth() - date2.getMonth());

    if (kind) {
      var diffindays = Math.floor(date2.getDate() - date1.getDate());
      var years = Math.floor(date2.getFullYear() - date1.getFullYear());
      var diffinmonths = Math.floor(date2.getMonth() - date1.getMonth());
    }

    diffinmonths += (diffindays / 30);
    years += (diffinmonths / 12);

    if (kind && (years == 0 && diffinmonths < 6))
      years--;

    return years;
  },
  compareDateWithDate: function(propertiesObject, plugin, uniqueKey) {
    var thisSelect = $("[data-uniqueelement='" + uniqueKey + "']"),
        dateObject = propertiesObject,
        result = [true, {placeErrorTo: thisSelect}],
        thisDate = new Date(thisSelect.val());

    if (dateObject.checkInput)
      dateObject.checkDate = new Date($(dateObject.checkInput).val());

    var diffDep = plugin.checkDate(dateObject.checkDate, thisDate, false);

    if (dateObject.limitation) {
      if (!(dateObject.limitation.limitEnd > diffDep)) {
        result[1].message = dateObject.message.limitEnd;
        result[0] = false;
      } else if (!(diffDep >= dateObject.limitation.limitStart)) {
        result[1].message = dateObject.message.limitStart;
        result[0] = false;
      }
    } else if (diffDep < 0 || diffDep > 0) {
      result[1].message = dateObject.message || "datesMustBeSame";
      result[0] = false;
    }

    return result;
  },
  checkIfSame: function(propertiesObject, plugin, uniqueKey) {
    var first = propertiesObject.elements[0],
      second = propertiesObject.elements[1],
      result = [true, {placeErrorTo: [first,second]}];


    if (propertiesObject.checkType == "password" && $(first).val().length < parseInt(minPassWordLength)) {
      result = [false, {placeErrorTo: first}];
    } else if ($(first).val().length) {
      if ($(second).val().length) {
        if ($(first).val() != $(second).val()) {
          result = [false, {placeErrorTo: [first,second], message: propertiesObject.message || "mustBeSame"}];
        }
      }
    } else {
      result = [false, {placeErrorTo: [first,second], message: propertiesObject.message || "mustBeSame"}];
    }

    return result;
  },
  checkID: function(propertiesObject, plugin, uniqueKey) {
    var natID = $(propertiesObject.elements[0]).val();

    var result = [true];
    if (natID != "")
      switch (propertiesObject.natIDType) {
        case "TR":

          var tckimlikno_str = natID;

          if (natID.length != 11) {
            result = [false];
          }

          Tmp = Math.floor(parseInt(tckimlikno_str) / 100);
          Tmp1 = Math.floor(parseInt(tckimlikno_str) / 100);

          int1 = parseInt(tckimlikno_str.substring(0, 1));
          int2 = parseInt(tckimlikno_str.substring(1, 2));
          int3 = parseInt(tckimlikno_str.substring(2, 3));
          int4 = parseInt(tckimlikno_str.substring(3, 4));
          int5 = parseInt(tckimlikno_str.substring(4, 5));
          int6 = parseInt(tckimlikno_str.substring(5, 6));
          int7 = parseInt(tckimlikno_str.substring(6, 7));
          int8 = parseInt(tckimlikno_str.substring(7, 8));
          int9 = parseInt(tckimlikno_str.substring(8, 9));

          odd_sum = int9 + int7 + int5 + int3 + int1;
          even_sum = int8 + int6 + int4 + int2;
          total = odd_sum * 3 + even_sum;

          ChkDigit1 = (10 - (total % 10)) % 10;
          odd_sum = ChkDigit1 + int8 + int6 + int4 + int2;
          even_sum = int9 + int7 + int5 + int3 + int1;
          total = odd_sum * 3 + even_sum;
          ChkDigit2 = (10 - (total % 10)) % 10;
          Tmp = Tmp * 100 + ChkDigit1 * 10 + ChkDigit2;

          if (Tmp != tckimlikno_str) {
            result = [false];
          }
          break;
        case "IR":
          if (natID.length != 10) {
            result = [false];
          } else {
            if (natID.substr(0, 3) == '000')
              result = [false];
            else {
              var check = 0;
              for (var i = 0; i < natID.length; i++) {
                var num = natID.substr(i, 1);
                check += num * (10 - i)
              }
              if (check % 11) {
                result = [false];
              }
            }
          }
          break;
      }
    return result;
  },
  checkForSelected: function(propertiesObject, plugin, uniqueKey) {
    var result = [true, {placeErrorTo: propertiesObject.placeErrorTo, parentTag: propertiesObject.parentTag, message: propertiesObject.message, type: propertiesObject.type}];
    if ($(propertiesObject.selectedItemParent).length && !$(propertiesObject.selectedItemParent + " " + propertiesObject.selectedItem).length) {
      result[0] = false;
    };

    return result;
  },
  emailCharacterCheck: function(e) {
    var keychar,
      regEx = /\@|\.|\-|\_/;

    if (e.type == "paste") {
      var data = $(e.target).val();
      var response = "";
      for (var i=0; i<data.length; i++) {
        var keyCode = data.charCodeAt(i);
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || (keyCode > 47) && (keyCode < 58) || regEx.test(data[i]))
          response += data[i];
      }
      e.target.value = response;
    }

    var keyCode;
    if (window.event) {
      keyCode = e.keyCode
    } else if (e.which) {
      keyCode = e.which
    }

    keychar = String.fromCharCode(keyCode);

    switch (keyCode) {
      case null:
      case 8:
      case 9:
      case 32:
        return true;
        break;
      default:
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || (keyCode > 47) && (keyCode < 58) || regEx.test(keychar))
          return true;
        break;
    };

    return false;
  },
  isNumericCheck: function(e) {
    var keyCode;
    if (window.event) {
      keyCode = e.keyCode
    } else if (e.which) {
      keyCode = e.which
    }

    if (e.type == "paste") {
      var data = $(e.target).val();
      var response = "";
      for (var i=0; i<data.length; i++) {
        var keyCode = data.charCodeAt(i);
        if ((keyCode > 47) && (keyCode < 58))
          response += data[i];
      }
      e.target.value = response;
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
  },
  isCharacterWithTurkishCheck: function(e) {
    var keyCode;
    var turkishCharacter = {
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
  },
  isCharacterCheck: function(e) {
    var keyCode;

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
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96))
          return true;
        break;

    };

    return false;
  },
  isPnrValidCheck: function(e) {
    var keyCode;

    if (e.type == "paste") {
      var data = $(e.target).val();
      var response = "";
      for (var i=0; i<data.length; i++) {
        var keyCode = data.charCodeAt(i);
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || (keyCode > 47) && (keyCode < 58))
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
      case 32:
        return false;
        break;
      default:
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || (keyCode > 47) && (keyCode < 58))
          return true;
        break;
    };
    return false;

  },
  initCheck: function(obj) {

    var validate = this;

    if (obj.Character)
      $.each(obj.Character, function(i, e) {
        $(document).on("keypress", e, validate.isCharacterWithTurkishCheck);
        $(document).on('paste', e, function(event) {
          validate.pasteHandler(event, validate, "Character");
          return true;
        });
      });

    if (obj.Numeric)
      $.each(obj.Numeric, function(i, e) {
        $(document).on("keypress", e, validate.isNumericCheck);
        $(document).on('paste', e, function(event) {
          validate.pasteHandler(event, validate, "Numeric");
          return true;
        });
      });

    if (obj.Email)
      $.each(obj.Email, function(i, e) {
        $(document).on("keypress", e, validate.emailCharacterCheck);
        $(document).on('paste', e, function(event) {
          validate.pasteHandler(event, validate, "Email");
          return true;
        });
      });

    if (obj.PNR)
      $.each(obj.PNR, function(i, e) {
        $(document).on("keypress", e, validate.isPnrValidCheck);
        $(document).on('paste', e, function(event) {
          validate.pasteHandler(event, validate, "PNR");
          return true;
        });
      });

    if (obj.Phone)
      $.each(obj.Phone, function(i, e) {
        $(document).on("keypress", e, function() {
          if (validate.isNumericCheck(event)) {
            return validate.checkPhoneAreaFull(this, event);
          };
          return validate.isNumericCheck(event);
        });
      });

    delete validate.initObject;
  },
  pasteHandler: function(event, plugin, initFunction) {
    setTimeout(function() {
      switch (initFunction) {
        case "Character":
          plugin.isCharacterWithTurkishCheck(event);
          break;
        case "Numeric":
          plugin.isNumericCheck(event);
          break;
        case "Email":
          plugin.emailCharacterCheck(event);
          break;
        case "PNR":
          plugin.isPnrValidCheck(event);
          break;
      }
    }, 50);
  },
  classNames: {
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
  },
  pageErrorHTML: "",
  errorMessages: {
    notBeEmpty: " can not be empty!",
    pageError: "Please check errors.",
    mustBeSame: "These inputs must have same values!",
    datesMustBeSame: "Dates must be same!"
  }
};
