/*
    Validation is jQuery based high compatible tool for checking any validation rule within HTML components.
    Validation has 15 main validation functions. You can add any function or basicly call
    any function when creating validation objects.

    * v2.1.4 - Realese 05/12/2016
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
          message: notBeEmpty,
          showLabel: true,
          visibility: true
        }
      }
    }
  },
  validationObj: {},
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
        plugin.validationObj[value] = validationObject;
      })
    } else
      plugin.validationObj[tag] = validationObject;
  },
  validate: function(eventType, tag, workType, returnFunction) {
    var plugin = this;

    if (typeof plugin.validationObj[tag] == "object")
      plugin.keypressValidation(plugin.validationObj[tag]);

    if (plugin.initObject)
      plugin.initCheck(plugin.initObject);

    if (workType != "self") {
      if (typeof returnFunction != "object") {
        if (typeof tag == "object") {
          $.each(tag, function(index,value) {
            if ($(value).attr("onclick")) {
              $(value).data("onclick", $(value).attr("onclick").replace("return false", ""));
              $(value).attr("onclick", null);
            };
            $(document).on(eventType, value, function(event) {
              var result = plugin.checkFilled(plugin.searchObj[value], workType) && !$("[data-hasError='true']").length;
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
            var result = plugin.checkFilled(plugin.searchObj[tag], workType) && !$("[data-hasError='true']").length;
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
        }
      } else {
        if (typeof tag == "object") {
          $.each(tag, function(index,value) {
            if ($(value).attr("onclick")) {
              $(value).data("onclick", $(value).attr("onclick").replace("return false", ""));
              $(value).attr("onclick", null);
            };
            $(document).on(eventType, value, function(event) {
              var result = plugin.checkFilled(plugin.searchObj[value], workType) && !$("[data-hasError='true']").length;
              if (result) {
                if(returnFunction)
                  for (var i=0; i < returnFunction.length;i++) {
                    eval(returnFunction[i]);
                  }
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
            $(tag).attr("onclick", null);
          };
          $(document).on(eventType, tag, function(event) {
            var result = plugin.checkFilled(plugin.searchObj[tag], workType) && !$("[data-hasError='true']").length;
            if (result) {
              if(returnFunction)
                for (var i=0; i < returnFunction.length;i++) {
                  eval(returnFunction[i]);
                }
              if ($(this).data("onclick")) {
           	  	 event.preventDefault();
                 eval($(this).data("onclick"));
              }
            }
            return result;
          });
        }
      }
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
              var currentElement = $(f).parents(propertiesObject.parentTag).find(".selectized").length ? $(f).parents(propertiesObject.parentTag).find("select")[0]: $(f).parents(propertiesObject.parentTag).find("input,select")[0];
              if (propertiesObject.visibility)
                if (!plugin.checkVisibility(currentElement))
                  return true;
              if (rule.test(f.innerHTML) && !plugin.checkEmpty(currentElement)) {
                if (plugin.errorObject)
                  plugin.errorObject[plugin.errorObject.length] = [currentElement, propertiesObject];
                else {
                  plugin.errorObject = [];
                  plugin.errorObject[plugin.errorObject.length] = [currentElement, propertiesObject];
                }
              };

            });
          });
          break;
        case "checkbox":
          plugin.checkCB(tagObject);
          break;

        case "empty":
          $.each(tagObject, function(tag, propertiesObject) {
            if (propertiesObject.elemets) {
              $.each(propertiesObject.elemets, function(index,value) {
                  var currentElement = $(value)[0];
                  if (propertiesObject.visibility)
                    if (!plugin.checkVisibility(currentElement))
                      return true;
                  if (!plugin.checkEmpty(currentElement)) {
                    if (plugin.errorObject) {
                      var newPropertiesObject = $.extend({}, propertiesObject);
                      if (newPropertiesObject.messageType == "List") newPropertiesObject.currentIndex = index;
                      plugin.errorObject[plugin.errorObject.length] = [currentElement, newPropertiesObject];
                    } else {
                      plugin.errorObject = [];
                      var newPropertiesObject = $.extend({}, propertiesObject);
                      if (newPropertiesObject.messageType == "List") newPropertiesObject.currentIndex = index;
                      plugin.errorObject[plugin.errorObject.length] = [currentElement, newPropertiesObject];
                    }
                  }
              });
            }
            else {
              var currentElement = $(tag);
              if (propertiesObject.visibility)
                if (!plugin.checkVisibility(currentElement))
                  return true;
              if (!plugin.checkEmpty(currentElement)) {
                if (plugin.errorObject)
                  plugin.errorObject[plugin.errorObject.length] = [currentElement, propertiesObject];
                else {
                  plugin.errorObject = [];
                  plugin.errorObject[plugin.errorObject.length] = [currentElement, propertiesObject];
                }
              };
            }
          });

      };
    });

    if (typeof plugin.errorObject == "object" && workType != "not-process-errors")
        plugin.processErrors();
    else
      return mainResult;

    return false;
  },
  keypressValidation: function(validationObj) {
    var plugin = this;
    $.each(validationObj, function(type, tagObject) {
      var eventType = type;
      $.each(tagObject, function(tag, propertiesObject) {
        if (propertiesObject.ruleObject) {
          $(document).on(eventType, tag, function(e) {
            if ((propertiesObject.visibility && !plugin.checkVisibility(this)) || $(this).val() == '')
              return false;
            var result = propertiesObject.ruleObject[0](propertiesObject.ruleObject[1], plugin, $(this));
            if (plugin.keypressErrorObject) {
              plugin.keypressErrorObject[2] = propertiesObject;
              plugin.processErrors("Keypress Error");
            } else if (plugin.keypressNodes)
              plugin.processErrors("Keypress Nodes");
            if (propertiesObject.withReturn)
              return result;
            if (!result[0]) {
              plugin.errorObject = [result[1]];
              plugin.processErrors("Add Self Class");
            } else {
              plugin.errorObject = [result[1]];
              plugin.processErrors("Remove Self Class");
            }
          });
        } else {
          $(document).on(eventType, tag, function(e) {
            if ((propertiesObject.visibility && !plugin.checkVisibility(this)) || $(this).val() == '')
              return false;
            if (!propertiesObject.rule(this)) {
              plugin.errorObject = [this];
              plugin.processErrors("Add Self Class");
            } else {
              plugin.errorObject = [this];
              plugin.processErrors("Remove Self Class");
            }
            if (plugin.keypressErrorObject) {
              plugin.keypressErrorObject[2] = propertiesObject;
              plugin.processErrors("Keypress Error");
            } else if (plugin.keypressNodes)
              plugin.processErrors("Keypress Nodes");
          });

        }
      });
    });
  },
  checkEmpty: function(tag) {
    var value = $(tag).val();
    return (value != "" && value != null && value != "null" && value.length);
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
  processErrors: function(processType) {
    var plugin = this;
    switch (processType) {
      default:
        $.each(this.errorObject, function(index, elementArray) {
          if (elementArray[1].messageType == "List")
            var errorDiv = plugin.createErrorDiv(elementArray[1].type, elementArray[1].showLabel, elementArray[1].messages[elementArray[1].currentIndex], elementArray[1].parentTag, elementArray[0]);
          else
            var errorDiv = plugin.createErrorDiv(elementArray[1].type, elementArray[1].showLabel, elementArray[1].message, elementArray[1].parentTag, elementArray[0]);

          var targetElement = $(elementArray[0]).parents(elementArray[1].parentTag);
          targetElement.find("."+plugin.classNames.errorDivClass).remove();
          targetElement.addClass(plugin.classNames.hasError).append(errorDiv);
          targetElement.find("."+plugin.classNames.errorDivClass).height(targetElement.find("."+plugin.classNames.errorDivClass).height());

          if ($(elementArray[0]).is("[id^='bday']")) {
            targetElementt.next().addClass(plugin.classNames.hasError).next().addClass(plugin.classNames.hasError);
          }

          plugin.changeRemover(elementArray);
          plugin.processErrorAnimation("add", elementArray);
        });
        plugin.processErrorAnimation("process");

        delete plugin.errorObject;
        break;
      case "Add Self Class":
        $(plugin.errorObject[0]).each(function(index, value) {
          $(value).addClass(plugin.classNames.errorSelfClass).removeClass(plugin.classNames.successSelfClass).attr("data-hasError", true);
        });
        delete plugin.errorObject;
        break;
      case "Remove Self Class":
        $(plugin.errorObject[0]).each(function(index, value) {
          $(value).removeClass(plugin.classNames.errorSelfClass).addClass(plugin.classNames.successSelfClass).attr("data-hasError", false);
        });
        delete plugin.errorObject;
        break;
      case "Keypress Error":
        var errorDiv = plugin.createErrorDiv("Rule", false, plugin.keypressErrorObject[1]);
        plugin.keypressErrorObject[0].parents(plugin.keypressErrorObject[2].parentTag).find("."+plugin.classNames.errorDivClass).remove();
        plugin.keypressErrorObject[0].parents(plugin.keypressErrorObject[2].parentTag).append(errorDiv);
        if (plugin.keypressNodes)
          plugin.processErrors("Keypress Nodes"),plugin.keypressNodes = [], plugin.keypressNodes[plugin.keypressNodes.length] = plugin.keypressErrorObject[0].parents(plugin.keypressErrorObject[2].parentTag).find("."+plugin.classNames.errorDivClass);

        else
          plugin.keypressNodes = [], plugin.keypressNodes[plugin.keypressNodes.length] = plugin.keypressErrorObject[0].parents(plugin.keypressErrorObject[2].parentTag).find("."+plugin.classNames.errorDivClass);
        delete plugin.keypressErrorObject;
        break;
      case "Keypress Nodes":
        $.each(plugin.keypressNodes, function(index,value) {
          value.remove();
        });
        delete plugin.keypressNodes;
        break;
    }
  },
  createErrorDiv: function(type, showLabel, message, parentTag, element) {
    var errorDiv;
    switch (type) {
      case "Label":
        if (showLabel)
          errorDiv = '<div class="' + this.classNames.errorDivClass + '">' + $(element).parents(parentTag).find("label")[0].innerHTML + message + '</div>';
        else
          errorDiv = '<div class="' + this.classNames.errorDivClass + '">' + message + '</div>';
        break;

      case "Rule":
        errorDiv = '<div class="' + this.classNames.errorDivClass + '">' + message + '</div>';
        break;

      case "Checkbox":
        errorDiv = '<div class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorCheckbox + '"></div>';
        break;

      case "Radio":
        errorDiv = '<div class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorRadio + '">' + message + '</div>';
        break;

      case "General":
        errorDiv = '<div class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorGeneral + '">' + message + '</div>';
        break;

      case "HasError":
        errorDiv = '<div class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorGeneral + '">' + message + '</div>';
        break;
    }
    return errorDiv;
  },
  changeRemover: function(elementObject) {
    var _this = this;
    var select = $(elementObject[0]).is("select");
    var checkbox = $(elementObject[0]).is("[type='checkbox']");
    var expire = $(elementObject[0]).is("[name^=\"expiry\"]");
    var id = "#" + $(elementObject[0]).attr("id") || "." + $(elementObject).attr("class");
    var date = $(elementObject[0]).attr("format");

    if (checkbox || date)
      $(document).on("change", id, function() {
        _this.removeErrorElements($(this).parents(elementObject[1].parentTag)),_this.updateBottomError(this.id||this.className);
      });
    else if (expire)
      $(document).on("change", id, function() {
        if ($(this).val() != "")
          _this.removeErrorElements($(this).parent().parent().parent()),_this.updateBottomError(this.id||this.className);
      });
    else if (select)
	    if ($(id).is("[id^='bday']")) {
	      $(document).on("change", id, function(e) {
	        if ($(e.target).val() != "")
	          _this.removeErrorElements($(e.target).parents(elementObject[1].parentTag)),_this.updateBottomError(this.id||this.className);
	      });
	      $(document).on("change", "#" + $(el).parents(elementObject[1].parentTag).next().find("select").attr("id"), function(e) {
	        if ($(e.target).val() != "")
	          _this.removeErrorElements($(e.target).parents(elementObject[1].parentTag)).remove();
	      });
	      $(document).on("change", "#" + $(el).parents(elementObject[1].parentTag).next().next().find("select").attr("id"), function(e) {
	        if ($(e.target).val() != "")
	          _this.removeErrorElements($(e.target).parents(elementObject[1].parentTag));
	      });
	    } else
	      $(document).on("change", id, function() {
	        if ($(this).val() != "")
	          _this.removeErrorElements($(this).parents(elementObject[1].parentTag)),_this.updateBottomError(this.id||this.className);
	      });
    else
	    $(document).on("keypress", id, function() {
	      if ($(this).val() != "")
	        _this.removeErrorElements($(this).parents(elementObject[1].parentTag)),_this.updateBottomError(this.id||this.className);
	    });
  },
  removeErrorElements: function(targetElement) {
    _this = this;
    if (!targetElement.is("." + _this.classNames.errorSuccess)) {
      targetElement.addClass(_this.classNames.errorSuccess);
      setTimeout(function() {
        targetElement.children("." + _this.classNames.errorDivClass).remove();
        targetElement.removeClass(_this.classNames.hasError);
      }, 1000);
      setTimeout(function() {
        targetElement.removeClass(_this.classNames.errorSuccess);
      }, 2000);
    }
  },
  updateBottomError: function(id) {
      $("[data-errorid='" + id + "']").remove();
      if (!$("." + this.classNames.bottomPageErrorClass + " ." + this.classNames.bottomEachErrorClass).length)
        this.deleteErrorPage();
  },
  processErrorAnimation: function(workStatus, errorObject) {
    var plugin = this;
    switch (workStatus) {
      case "add":
        var selectedDiv = $(errorObject[0]);
        plugin.pageErrorParent = selectedDiv.parents(errorObject[1].parentTag);
        if (selectedDiv.is("select")) {
          plugin.pageErrorHTML += "<div data-errorid=\'" + (selectedDiv[0].id || selectedDiv[0].className) + "\' class='" + plugin.classNames.bottomEachErrorClass +
           "' onclick='$(\"html,body\").stop().animate({scrollTop:" + plugin.pageErrorParent.offset().top + "});$(\"#"+selectedDiv.attr("id")+"\").next(\".selectize-control\").children(\".selectize-input\").trigger(\"click\");' >";
          plugin.pageErrorHTML += errorObject[1].messages ? errorObject[1].messages[errorObject[1].currentIndex] : errorObject[1].showLabel ? plugin.pageErrorParent.find("label").text() + " " + errorObject[1].message : errorObject[1].message || plugin.pageErrorParent.find("label").text();
          plugin.pageErrorHTML += "</div>";
        }else {
          plugin.pageErrorHTML += "<div data-errorid='" + (selectedDiv[0].id || selectedDiv[0].className) + "' class='" + plugin.classNames.bottomEachErrorClass +
           "' onclick='$(\"html,body\").stop().animate({scrollTop:" + plugin.pageErrorParent.offset().top + "});$(\"#"+selectedDiv.attr("id")+"\").focus();' >";
          plugin.pageErrorHTML += errorObject[1].messages ? errorObject[1].messages[errorObject[1].currentIndex] : errorObject[1].showLabel ? plugin.pageErrorParent.find("label").text() + " " + errorObject[1].message : errorObject[1].message || plugin.pageErrorParent.find("label").text();
          plugin.pageErrorHTML += "</div>";
        }
        break;
      case "process":
        $("." + plugin.classNames.topPageErrorClass + "," + "." + plugin.classNames.bottomPageErrorClass).remove();
        $("body").prepend("<div class='" + plugin.classNames.topPageErrorClass + "'>"+ pageError +"</div>");
        $("body").prepend("<div style='left:" + plugin.pageErrorParent.offset().left + "px' class='" + plugin.classNames.bottomPageErrorClass + "'><div class='inside'><div class='inner'><div class='" + plugin.classNames.errorHeadingClass + "'> " + pageError +  "</div>" + plugin.pageErrorHTML + "</div><div class='close'></div></div></div>");
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
  checkEmail: function(e) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var email = $(e).val();
    if (!re.test(email) || email == "" || email == null) {
      return false;
    }
    return true;
  },
  checkPhone: function(e) {
    var result = true;

    f = "#alt-tel-number";

    $(e).each(function(index) {

      if ($(this).val() == null || $(this).val() == "")
        result = false;

      var count = this.id.replace("frst-tel-number", "");

      if (this.value == $(f + count).val()) {
        result = false;
      }

      if (this.value.length < 6 && /\ /g.test(this.value[this.value.length-1]) || (!/\+/g.test(this.value) && !this.value.length))
        return true;

      if (!$(this).intlTelInput("isValidNumber")) {
        switch ($(this).intlTelInput("getValidationError")) {

          case intlTelInputUtils.validationError.TOO_SHORT:
            result = false;
            break;

          case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
            result = false;
            break;

          case intlTelInputUtils.validationError.TOO_LONG:
            result = false;
            break;

          default:
            result = false;
            break;

        }
      }

      if ($(f + count).val() != null && $(f + count).val() != "" && !$(f + count).intlTelInput("isValidNumber")) {
        switch ($(f + count).intlTelInput("getValidationError")) {

          case intlTelInputUtils.validationError.TOO_SHORT:
            result = false;
            break;

          case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
            result = false;
            break;

          case intlTelInputUtils.validationError.TOO_LONG:
            result = false;
            break;

          default:
            result = false;
            break;

        }
      }
    });

    return result;
  },
  checkCounts: function(passengers, plugin, nodeElement) {
    var adult = passengers[0],
      child = passengers[1],
      infant = passengers[2];

    e = "#adult", f = "#child", g = "#infant";

    var result = [true, adult, child, infant];
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
      result = [false, adult, infant], plugin.keypressErrorObject = [nodeElement, infCantGreater];
    else if (totalAdultCount == 0 && totalChildCount > 0)
      result = [false, adult, infant], plugin.keypressErrorObject = [nodeElement, withoutParents];
    else if (totalSeatCount > maxPassengerCount)
      result = [false, adult, infant, child], plugin.keypressErrorObject = [nodeElement, maxPassengerError];
    else if (totalSeatCount == 0)
      result = [false, adult, infant, child], plugin.keypressErrorObject = [nodeElement, leastOnePassenger];

    return result;

  },
  checkDate: function(date1, date2, kind) {
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var diffindays = Math.floor(date1.getDate() - date2.getDate());
    var years = Math.floor(date1.getFullYear() - date2.getFullYear());
    var diffinmonths = Math.floor(date1.getMonth() - date2.getMonth());
    if (kind) {
      var diffindays = Math.floor(date2.getDate() - date1.getDate());
      var years = Math.floor(date2.getFullYear() - date1.getFullYear());
      var diffinmonths = Math.floor(date2.getMonth() - date1.getMonth());
    }

    if (!(diffindays >= 0))
      diffinmonths += (diffindays / 30);
    if (!(diffinmonths >= 0))
      years += (diffinmonths / 12);

    if (kind && (years == 0 && diffinmonths < 6))
      years--;


    var message = date2.toDateString();

    return years;

  },
  compareDateWithDate: function(dateObject, thisPlugin, thisSelect) {
    thisSelect = $(thisSelect);

    var thisHiddenObject = $("#" + thisSelect.attr("id").split("_")[0] + "_hidden_" + thisSelect.attr("id").split("_")[2]);
    var dateParent = [thisHiddenObject.next(), thisHiddenObject.next().next(), thisHiddenObject.next().next().next()];
    var result = [true, dateParent];

    var thisHidden = thisHiddenObject.val();
    if (thisHidden == "NaN") {
      return [false, dateParent];
    }

    if (thisHidden == null || thisHidden == "") {
      return [false, dateParent];
    }

    var checkDate = dateObject.startDate == dateObject.endDate ? dateObject.startDate:dateObject.endDate;
    var whichDate = dateObject.startDate == dateObject.endDate ? "departureDate":"returnDate";

    var title = thisSelect[0].id.split("_")[0];
    var paxType = thisSelect.parents(".tab-pane").length ? thisSelect.parents(".tab-pane").data("paxType"): "ADLT";

    var limitStart = dateObject.limitationByType[title][paxType][0];
    var limitEnd = dateObject.limitationByType[title][paxType][1];

    var thisDate = new Date(parseInt(thisHidden));

    var innerValidate = new validator();
    var diffDep = innerValidate.checkDate(checkDate, thisDate, false);

    if (!(limitEnd > diffDep)) {
      result = [false, dateParent];
      thisPlugin.keypressErrorObject = [thisSelect, ageError[title][paxType][whichDate].lower];
    } else if (!(diffDep >= limitStart)) {
      result = [false, dateParent];
      thisPlugin.keypressErrorObject = [thisSelect, ageError[title][paxType][whichDate].higher];
    }

    return result;

  },
  checkIfSame: function(array, thisPlugin) {
    var first = array[0],
      second = array[1],
      result = [true, $(array[0])];


    if (array[2] == "password" && $(first).val().length < parseInt(minPassWordLength)) {
      result = [false, first];
    } else if ($(first).val().length) {
      if ($(second).val().length) {
        if ($(first).val() == $(second).val()) {
          result = [true, [first, second]];
        } else {
          result = [false, [first, second]];
          thisPlugin.keypressErrorObject = [$(first), mustBeSame];
        }
      } else {
        result = [false, second];
      }
    } else {
      result = [false, first];
    }

    return result;
  },
  checkID: function(idArray, thisPlugin, current) {
    var natID = idArray[0];
    var natIDtype = idArray[1];

    var result = [true, current];
    if (natID != "")
      switch (natIDtype) {
        case "TR":

          var tckimlikno_str = natID;

          if (natID.length != 11) {
            result[0] = false;
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
            result[0] = false;
          }
          break;
        case "IR":
          if (natID.length != 10) {
            result[0] = false;
          } else {
            if (natID.substr(0, 3) == '000')
              result[0] = false;
            else {
              var check = 0;
              for (var i = 0; i < natID.length; i++) {
                var num = natID.substr(i, 1);
                check += num * (10 - i)
              }
              if (check % 11) {
                result[0] = false;
              }
            }
          }
          break;
      }
    return result;
  },
  checkCB: function(tagObject) {
    var plugin = this;
    $.each(tagObject, function (tag, propertiesObject) {
      if (!$(tag).prop("checked") && $(tag).is(":visible")) {
        if (plugin.errorObject)
          plugin.errorObject[plugin.errorObject.length] = [$(tag), propertiesObject];
        else {
          plugin.errorObject = [];
          plugin.errorObject[plugin.errorObject.length] = [$(tag), propertiesObject];
        }
      }
    });
  },
  checkForSelected: function(checkObject, thisPlugin) {
    result = true;
    $.each(checkObject, function(name, propertiesObject) {
      if ($(propertiesObject.selectedItemParent).length && !$(propertiesObject.selectedItemParent + " " + propertiesObject.selectedItem).length) {
        thisPlugin.processErrorObject([$(propertiesObject.notSelectedItem), propertiesObject]);
        result = false;
      }
    });

    if (!result)
      thisPlugin.processErrors();

    return result;
  },
  emailCharacterCheck: function(e) {
    var keychar,
      regEx,
      validate = new validator();
    var keyCode;
    if (window.event) {
      keyCode = e.keyCode
    } else if (e.which) {
      keyCode = e.which
    }

    keychar = String.fromCharCode(keyCode);
    regEx = new RegExp("\@|\.|\-|\_");

    switch (keyCode) {
      case null:
      case 8:
      case 9:
      case 32:
        return true;
        break;
      default:
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || validate.isNumericCheck(e) || regEx.test(keychar) > -1)
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
    var insideValidation = new validator;
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
        if (insideValidation.isCharacterCheck(e) || insideValidation.isNumericCheck(e))
          return true;
        break;
    };
    return false;

  },
  initCheck: function(obj) {

    var validate = this;

    if (obj.Character)
      $.each(obj.Character, function(i, e) {
        $(e).on("keypress", validate.isCharacterWithTurkishCheck);
      });

    if (obj.Numeric)
      $.each(obj.Numeric, function(i, e) {
        $(e).on("keypress", validate.isNumericCheck);
      });

    if (obj.Email)
      $.each(obj.Email, function(i, e) {
        $(e).on("keypress", validate.emailCharacterCheck);
      });

    if (obj.PNR)
      $.each(obj.PNR, function(i, e) {
        $(e).on("keypress", validate.isPnrValidCheck);
      });

    if (obj.Phone)
      $.each(obj.Phone, function(i, e) {
        $(e).on("keypress", function() {
          if (validate.isNumericCheck(event)) {
            return validate.checkPhoneAreaFull(this, event);
          };
          return validate.isNumericCheck(event);
        });
      });

    delete validate.initObject;
  },
  classNames: {
    "errorDivClass": "input-error",
    "errorSelfClass": "input__error",
    "hasError": "has__error",
    "errorCheckbox": "e__checkbox",
    "errorRadio": "e__radio",
    "errorGeneral": "general",
    "errorSuccess": "error__success",
    "successSelfClass": "input__success",
    "errorHeadingClass": "error__heading",
    "bottomPageErrorClass": "page__error__bottom",
    "bottomEachErrorClass": "each__error",
    "topPageErrorClass": "page__error__top"
  },
  pageErrorHTML: ""
};
