/*
    Validation is jQuery based high compatible tool for checking any rule in HTMLs.
    Validation has 15 main validation functions. You can add any function or basicly call
    any function when creating validation objects.

    * v2.0.0 - Realese 04/08/2016
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
          parentTag: ".form-group",
          type: "Label",
          message: "can not be empty.",
          showLabel: true,
          visibility: false
        }
      }
    }
  },
  validationObj: {},
  addSearchObject: function(tag, searchObject) {
    this.searchObj[tag] = searchObject;
  },
  addValidationObject: function(tag, validationObject) {
    this.validationObj[tag] = validationObject;
  },
  validate: function(eventType, tag, workType) {
    var plugin = this;

    if (typeof plugin.validationObj[tag] == "object")
      plugin.keypressValidation(plugin.validationObj[tag]);

    if (plugin.initObject)
      plugin.initCheck(plugin.initObject);

    if (workType != "self")
      $(document).on(eventType, tag, function() {
        return plugin.checkFilled(plugin.searchObj[tag], workType) && !$("[data-hasError='true']").length;
      });

  },
  checkFilled: function(searchObject, workType) {
    var plugin = this;
    if (workType == "main")
      plugin.checkFilled(plugin.searchObj["main"]);
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
                    if (plugin.errorObject)
                      propertiesObject.messageType == "List" ? plugin.errorObject[plugin.errorObject.length] = [[currentElement, index], propertiesObject] : plugin.errorObject[plugin.errorObject.length] = [currentElement, propertiesObject];
                    else {
                      plugin.errorObject = [];
                      propertiesObject.messageType == "List" ? plugin.errorObject[plugin.errorObject.length] = [[currentElement, index], propertiesObject] : plugin.errorObject[plugin.errorObject.length] = [currentElement, propertiesObject];
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

    if (typeof plugin.errorObject == "object")
        plugin.processErrors();
    else
      return true;

    return false;
  },
  keypressValidation: function(validationObj) {
    var plugin = this;
    $.each(validationObj, function(type, tagObject) {
      var eventType = type;
      $.each(tagObject, function(tag, propertiesObject) {
        if (propertiesObject.ruleObject) {
          $(document).on(eventType, tag, function(e) {
            if (propertiesObject.visibility && plugin.checkVisibility(this))
              return false;
            var result = propertiesObject.ruleObject[0](propertiesObject.ruleObject[1]);
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
            if (propertiesObject.visibility && plugin.checkVisibility(this))
              return false;
            if (!propertiesObject.rule(this)) {
              plugin.errorObject = [this];
              plugin.processErrors("Add Self Class");
            } else {
              plugin.errorObject = [this];
              plugin.processErrors("Remove Self Class");
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
  checkVisibility: function(tag) {
    return $(tag).is(":visible");
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
      default: $.each(this.errorObject, function(index, elementArray) {
        if (elementArray[1].messageType == "List")
          var errorDiv = plugin.createErrorDiv(elementArray[1].type, elementArray[1].showLabel, elementArray[1].messages[elementArray[0][1]], elementArray[1].parentTag, elementArray[1][0]);
        else
          var errorDiv = plugin.createErrorDiv(elementArray[1].type, elementArray[1].showLabel, elementArray[1].message, elementArray[1].parentTag, elementArray[0]);

        $(elementArray[0]).parents(elementArray[1].parentTag).find("."+plugin.classNames.errorDivClass).remove();
        $(elementArray[0]).parents(elementArray[1].parentTag).prepend(errorDiv);

        if ($(elementArray[0]).is("[id^='bday']")) {
          var errorDiv = '<span class="' + plugin.classNames.errorDivClass + '">' + ' ' + '</span>';
          $(elementArray[0]).parents(elementArray[1].parentTag).next().prepend(errorDiv).next().prepend(errorDiv);
        }

        plugin.changeRemover(elementArray[0]);
      });
      this.errorObject = [];
      break;
      case "Add Self Class":
          $(plugin.errorObject[0]).each(function(index, value) {
          $(value).addClass(plugin.classNames.errorSelfClass).removeClass(plugin.classNames.successSelfClass).attr("data-hasError", true);
        });
        plugin.errorObject = [];
        break;
      case "Remove Self Class":
          $(plugin.errorObject[0]).each(function(index, value) {
          $(value).removeClass(plugin.classNames.errorSelfClass).addClass(plugin.classNames.successSelfClass).attr("data-hasError", false);
        });
        plugin.errorObject = [];
        break;
    }
  },
  createErrorDiv: function(type, showLabel, message, parentTag, element) {
    var errorDiv;
    switch (type) {
      case "Label":
        if (showLabel)
          errorDiv = '<span class="' + this.classNames.errorDivClass + '">' + $(element).parents(parentTag).find("label")[0].innerHTML + message + '</span>';
        else
          errorDiv = '<span class="' + this.classNames.errorDivClass + '">' + message + '</span>';
        break;

      case "Rule":
        errorDiv = '<span class="' + this.classNames.errorDivClass + '">' + message + '</span>';
        break;

      case "Checkbox":
        errorDiv = '<span class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorCheckbox + '">' + message + '</span>';
        break;

      case "Radio":
        errorDiv = '<span class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorRadio + '">' + message + '</span>';
        break;

      case "General":
        errorDiv = '<span class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorGeneral + '">' + message + '</span>';
        break;

      case "HasError":
        errorDiv = '<span class="' + this.classNames.errorDivClass + ' ' + this.classNames.errorGeneral + '">' + message + '</span>';
        break;
    }
    return errorDiv;
  },
  changeRemover: function(el) {
    var plugin = this;
    var select = $(el).is("select");
    var checkbox = $(el).is("[type='checkbox']");
    var type = $(el).attr("type") == "tel";
    var expire = el == "[name^=\"expiry\"]";
    var id = "#" + $(el).attr("id");

    if (!select && !checkbox && !type)
      $(document).on("blur", id, function() {
        if ($(this).val() != "")
          if ($(this).parent().find(plugin.classNames.errorDivClass).length)
            $(this).prev().prev().remove();
          // else   // Burası üzerinde element varsa bir üzerinden arasın diye yazilmis ancak ikinci kez calistiginda butun formu silebiliyor
          //   $(this).parent().parent().find(".input-error").remove();
      });
    else if (checkbox)
      $(document).on("change", id, function() {
        $(this).parent().find(plugin.classNames.errorDivClass).remove();
      });
    else if (type)
      $(document).on("blur", id, function() {
        if ($(this).val() != "")
          $(this).parent().prev().prev().remove();
      });
    else
      $(document).on("change", id, function() {
        if ($(this).val() != "")
          $(this).parent().prev().prev().remove();
      });
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
  checkCounts: function(passengers) {
    var adult = passengers[0],
      child = passengers[1],
      infant = passengers[2];

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
      result = [false, adult, infant];
    else if (totalAdultCount == 0 && totalChildCount > 0)
      result = [false, adult, infant];
    else if (totalSeatCount > maxPassengerCount)
      result = [false, adult, infant, child];
    else if (totalSeatCount == 0)
      result = [false, adult, infant, child];

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
  compareDateWithHidden: function(e) {
    var result = [true, e];

    var thisHidden = $("[id*='hidden']").val();
    if (thisHidden == "NaN") {
      result = [false, e];
    }

    if (thisHidden == null || thisHidden == "") {
      result = [false, e];
    }

    var limitStart = limitationByType[0];
    var limitEnd = limitationByType[1];
    var startdate = new Date();

    var bday = new Date(parseInt(thisHidden));

    var innerValidate = new validator();
    var diffDep = innerValidate.checkDate(startdate, bday, false);

    if (!(limitEnd > diffDep)) {
      result = [false, e];
    } else if (!(diffDep >= limitStart)) {
      result = [false, e];
    }

    return result;

  },
  checkIfSame: function(array) {
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
        }
      } else {
        result = [false, second];
      }
    } else {
      result = [false, first];
    }

    return result;
  },
  checkID: function(idArray) {
    var natID = idArray[0];
    var natIDtype = idArray[1];

    var result = true;
    if (natID != "")
      switch (natIDtype) {
        case "TR":

          var tckimlikno_str = natID;

          if (natID.length != 11) {
            result = false;
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
            result = false;
          }
          break;
        case "IR":
          if (natID.length != 10) {
            result = false;
          } else {
            if (natID.substr(0, 3) == '000')
              result = false;
            else {
              var check = 0;
              for (var i = 0; i < natID.length; i++) {
                var num = natID.substr(i, 1);
                check += num * (10 - i)
              }
              if (check % 11) {
                result = false;
              } else {
                result = true;
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
  checkForSelected: function(checkObject) {
    var plugin = this[2],
    result = true;
    $.each(checkObject, function(name, propertiesObject) {
      if ($(propertiesObject.selectedItemParent).length && !$(propertiesObject.selectedItemParent + " " + propertiesObject.selectedItem).length) {
        plugin.processErrorObject([$(propertiesObject.notSelectedItem), propertiesObject]);
        result = false;
      }
    });

    if (!result)
      plugin.processErrors();

    return result;
  },
  emailCharacterCheck: function(e) {
    var keychar,
      regEx;
    var keyCode;
    if (window.event) {
      keyCode = e.keyCode
    } else if (e.which) {
      keyCode = e.which
    }

    keychar = String.fromCharCode(keyCode);
    regEx = '@.-_';

    switch (keyCode) {
      case null:
      case 8:
      case 9:
      case 32:
        return true;
        break;
      default:
        if ((keyCode > 64 && keyCode < 91) || (keyCode < 123 && keyCode > 96) || validate.isNumericCheck(e) || regEx.indexOf(keychar) > -1)
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
        if (validate.isCharacterCheck(e) || validate.isNumericCheck(e))
          return true;
        break;
    };
    return false;

  },
  initCheck: function(obj) {

    var validate = this;

    if (obj.Character)
      $.each(obj.Character, function(i, e) {
        $(e).bind("keypress", validate.isCharacterWithTurkishCheck);
      });

    if (obj.Numeric)
      $.each(obj.Numeric, function(i, e) {
        $(e).bind("keypress", validate.isNumericCheck);
      });

    if (obj.Email)
      $.each(obj.Email, function(i, e) {
        $(e).bind("keypress", validate.emailCharacterCheck);
      });

    if (obj.PNR)
      $.each(obj.PNR, function(i, e) {
        $(e).bind("keypress", validate.isPnrValidCheck);
      });

    if (obj.Phone)
      $.each(obj.Phone, function(i, e) {
        $(e).bind("keypress", function() {
          if (validate.isNumericCheck(event)) {
            return validate.checkPhoneAreaFull(this, event);
          };
          return validate.isNumericCheck(event);
        });
      });
  },
  classNames: {
    "errorDivClass": "input-error",
    "errorSelfClass": "input__error",
    "errorCheckbox": "e__checkbox",
    "errorRadio": "e__radio",
    "errorGeneral": "general",
    "successSelfClass": "input__success"
  }
};
