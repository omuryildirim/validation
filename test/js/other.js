$(document).ready(function () {
    var api = new base();
    api.run();

    /* validation.creator */
    var HTMLtoVALIDATION = function(e) {
      console.log("validation created");
    };
    HTMLtoVALIDATION.prototype = {
      elementID: 0,
      inputData: {},
      getTagName: function(element) {
        var tagName = $(element).attr("class") ? "." + $(element).attr("class") : $(element)[0].id ? "#" + $(element)[0].id : $(element)[0].tagName;
        return tagName;
      },
      createInputs: function(inputString) {
        this.elementID += 1;
        var plugin = this;
        $(".HTMLtoVALIDATION, .tab__button").removeClass("active");
        var newArea = $("<div/>", {
          class: "HTMLtoVALIDATION active",
          html: inputString + "<div class='button remove__this'>Remove Input</div>",
          "data-element": this.elementID
        }).appendTo($(".show__HTML"));
        $("<div class=\"tab__button active\" data-element=\"" + this.elementID + "\">Input " + this.elementID + "</div>").appendTo($(".tab__buttons"));
        var elements = newArea.find("input,select,textarea");
        $.each(elements, function(index, element) {
          var elementTag = element.id ? "#" + element.id : $(element).attr("class") ? "." + $(element).attr("class") : element.tagName;
          var elementParentTag;
          var elementParent = $(element).attr("data-inputelement",plugin.elementID).parent();
          plugin.inputData[plugin.elementID] = {};
          for (var i = 0; i < 5; i++) {
            if (elementParent.is(".HTMLtoVALIDATION")) {
              if (!elementParentTag) {
                var singleElement = $("<div/>", {
                  class: "input__parent"
                }).append($(element)).prependTo(elementParent);
                if (newArea.find(".input__parent").length > 1 && index) {
                  plugin.elementID += 1;
                  elementParent = $("<div/>", {
                    class: "HTMLtoVALIDATION",
                    html: "<div class='button remove__this'>Remove Input</div>",
                    "data-element": plugin.elementID
                  }).appendTo($(".show__HTML"));
                  $("<div class=\"tab__button\" data-element=\"" + plugin.elementID + "\">Input " + plugin.elementID + "</div>").appendTo($(".tab__buttons"));
                  singleElement.prependTo(elementParent).after($("<div/>", {class: "settings active", "data-element": plugin.elementID}));
                } else
                  elementParent.append($("<div/>", {class: "settings active", "data-element": plugin.elementID}));
              }
              break;
            } else if (!elementParentTag) {
              elementParentTag = elementParent[0].id ? "#" + elementParent[0].id : $(elementParent).attr("class") ? "." + $(elementParent).attr("class") : elementParent[0].tagName;
              elementParent.addClass("input__parent");

              if (newArea.find(".input__parent").length > 1 && index) {
                plugin.elementID += 1;
                var newParent = $("<div/>", {
                  class: "HTMLtoVALIDATION",
                  html: "<div class='button remove__this'>Remove Input</div>",
                  "data-element": plugin.elementID
                }).appendTo($(".show__HTML"));
                $("<div class=\"tab__button\" data-element=\"" + plugin.elementID + "\">Input " + plugin.elementID + "</div>").appendTo($(".tab__buttons"));
                elementParent.prependTo(newParent);
              }
              elementParent.after($("<div/>", {class: "settings active", "data-element": plugin.elementID}));
              break;
            } else
              break;

            elementParent = $(elementParent).parent();
          }
          var propertiesObject = {};
          propertiesObject[elementTag] = {};
          if (elementParentTag)
            propertiesObject[elementTag]["parentTag"] = elementParentTag;
          plugin.inputData[plugin.elementID].propertiesObject = propertiesObject;


          /* create settings */
          var submitButton = "<div class='input__parent'><label>Select which button will be effected by validation?</label><select id='submitButton'>";
          if (editor.buttonList && Object.keys(editor.buttonList).length) {
            var keys = Object.keys(editor.buttonList);
            for (var i=0; i < keys.length; i++) {
              submitButton += "<option value=\"" + editor.buttonList[keys[i]] + "\">" + editor.buttonList[keys[i]] + "</option>";
            }
          } else {
            submitButton += "<option>You must add at least one button to create validation</option>";
          }
          submitButton += "</select></div>";
          var validationFunction = $("<select id='validationFunction'/>").append("<option>Select a validation</option>");
          $.each(editor.functionObject, function(element, object) {
            $("<option value='" + element + "'>" + object.message + "</option>").appendTo(validationFunction);
          });
          var validationSelect = $("<div class='input__parent'/>").append("<label>What validation do you want?</label>").append(validationFunction);
          $(".settings[data-element='" + $(this).parents(".HTMLtoVALIDATION").data("element") + "']").html("").append(submitButton, validationSelect);
        });
      },
      createButtons: function(inputString) {
        var button = $("<div />", {
          class: "button__parent",
          html: inputString + "<div class=\"remove__this button\">Remove Button</div>" + "<div class=\"input__parent\"><label>On button click, check inputs which has a '*' char on their label?</label><input class=\"checkbox\" type=\"checkbox\" id=\"checkMain\"></input></div>"
        }).appendTo($(".show__button"));
        var elementTag = button.children()[0].id ? "#" + button.children()[0].id : button.children().attr("class") ? "." + button.children().attr("class") : button.children()[0].tagName;
        button.children().data("elementTag", elementTag);
        if (!this.buttonList) this.buttonList = {}, this.buttonList[elementTag] = elementTag;
        else this.buttonList[elementTag] = elementTag;
        $("#submitButton").each(function(index,value) {
          var keys = Object.keys(editor.buttonList);
          $(value).html("");
          for (var i=0; i < keys.length; i++) {
            $(value).append("<option value=\"" + editor.buttonList[keys[i]] + "\">" + editor.buttonList[keys[i]] + "</option>");
          }
        });
      },
      removeElement: function(element) {
        if ($(element).parent().is(".button__parent"))
          delete this.buttonList[$(element).prev().data("elementTag")];
        if ($(element).parent().is(".HTMLtoVALIDATION"))
          $(".tab__button[data-element='" + $(element).parent().data("element") + "']").remove(), $(".tab__button").trigger("click");
        if ($(element).parent().is(".validation__object"))
          $("body").data("validationHtml", {}), $(".object").removeClass("created");
        $(element).parent().remove();
      },
      fillSettings: function(element) {
        var validationFunction= $(element).val();

        if ($(element).parent().parent().find("#settings").length)
          $("#settings").html("");
        else
          $("<div id='settings'/>").appendTo($(element).parent().parent());

        var settingsDiv = $(element).parent().parent().find("#settings");

        $.each(this.functionObject[validationFunction].rules, function(index,setting) {
          switch (index) {
            case "elements":
              for (var i=1;i<setting;i++) {
                $("<div class='input__parent'><label>Please Type " + (i+1) +". element</label><textarea id='element" + i + "'></textarea></div>").appendTo(settingsDiv);
              }
              break;
            case "message":
              $("<div class='input__parent'><label>Type a Error Message if you want</label><input id='message'></input></div>").appendTo(settingsDiv);
              break;
            case "visibility":
              $("<div class='input__parent'><label>Check validation if input is visible?</label><input type='checkbox' class='checkbox' id='visibility'></input></div>").appendTo(settingsDiv);
              break;
            case "showLabel":
              $("<div class='input__parent'><label>Do you want to show label in error message?</label><input type='checkbox' class='checkbox' id='showLabel'></input></div>").appendTo(settingsDiv);
              break;
            case "natIDType":
              var select = $("<select id='natIDType'/>").append("<option>Select national id</option>");
              $.each(setting, function(index,value) {
                $("<option></option>", {value: value, html: value}).appendTo(select);
              });
              $("<div class='input__parent'></div>").append("<label>Select national id</label>").append(select).appendTo(settingsDiv);
              break;
            case "checkType":
              var select = $("<select id='checkType'/>").append("<option>Select check type</option>");
              $.each(setting, function(index,value) {
                $("<option></option>", {value: value, html: value}).appendTo(select);
              });
              $("<div class='input__parent'></div>").append("<label>Select check type</label>").append(select).appendTo(settingsDiv);
              break;
            case "selectedItem":
              $("<div class='input__parent'><label>Selected status</label><input id='selectedItem'></input></div>").appendTo(settingsDiv);
              break;
            case "selectedItemParent":
              $("<div class='input__parent'><label>Selected element parent</label><input id='selectedItemParent'></input></div>").appendTo(settingsDiv);
              break;
            case "notSelectedItem":
              $("<div class='input__parent'><label>Not selected status</label><input id='notSelectedItem'></input></div>").appendTo(settingsDiv);
              break;
            case "startDate":
              $("<div class='input__parent'><label>Select start date</label><input id='startDate' type='date'></input></div>").appendTo(settingsDiv);
              break;
            case "endDate":
              $("<div class='input__parent'><label>Select end date</label><input id='endDate' type='date'></input></div>").appendTo(settingsDiv);
              break;
          }
        });

        if (!settingsDiv.parent().find("#activateValidation").length)
          var activateValidation = $("<div id='activateValidation' class='button'>Activate Validation</div>").appendTo(settingsDiv.parent());
      },
      createValidationObject: function(element) {
        var plugin = this,
        $this = $(element),
        parent = $this.parent(),
        elementID = parent.data("element"),
        currentInput = $("[data-inputelement='" + elementID +"']"),
        elementTagName = plugin.getTagName(currentInput);

        if (!editor.validationHtml)
          editor.validationHtml = {};

        var validationObject = plugin.inputData[elementID][plugin.inputData[elementID].validationType];

        switch (plugin.inputData[elementID].validationType) {
          case "validationObject":

            if (validationObject) {
              if (!validationObject.ruleObject) {
                plugin.inputData[elementID][plugin.inputData[elementID].validationType] = $.extend(true, {}, {ruleObject: [validationObject]});
              }
            } else {
              plugin.inputData[elementID][plugin.inputData[elementID].validationType] = {}, validationObject = plugin.inputData[elementID][plugin.inputData[elementID].validationType];
            }

            var eventType = currentInput.is("select") ? "change":currentInput.is("input,textarea") ? "keyup":"click";
            var propertiesObject = {};
            propertiesObject.rule = "validate." + parent.find("#validationFunction").val();
            propertiesObject.message = parent.find("#validationMessage").val();
            if (parent.find("#showLabel").is(":checked")) propertiesObject[selectedFunction].showLabel = true;
            if (parent.find("#visibility").is(":checked")) propertiesObject[selectedFunction].visibility = true;
            propertiesObject.parentTag = plugin.inputData[elementID].propertiesObject.parentTag;

            if (parent.find("[id^='element']").length) {
              propertiesObject.elements = [];
              propertiesObject.elements[0] = elementTagName;
              $.each(parent.find("[id^='element']"), function(index,value) {
                propertiesObject.elements[index+1] = plugin.getTagName(value);
              });
            }

            if (propertiesObject.message && !propertiesObject.parentTag) {
              alert("You must add a parent element to your input for displaying error message!");
              return false;
            }

            propertiesObject.eventType = eventType;
            propertiesObject.button = $("#submitButton").val();

            switch (parent.find("#validationFunction").val()) {
              case "checkPhone":
              case "checkEmail":
                if (plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject)
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject[plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject.length] = propertiesObject;
                else
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType] = propertiesObject;
                break;
              case "checkCounts":
              case "checkIfSame":
                if (plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject)
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject[plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject.length] = propertiesObject;
                else
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject = [propertiesObject];
                break;
              case "checkForSelected":
                propertiesObject.selectedItem = parent.find("#selectedItem").val();
                propertiesObject.selectedItemParent = parent.find("#selectedItemParent").val();
                propertiesObject.notSelectedItem = parent.find("#notSelectedItem").val();
                if (plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject)
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject[plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject.length] = propertiesObject;
                else
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject = [propertiesObject];
                break;
              case "checkID":
                propertiesObject.natIDType = parent.find("#natIDType").val();
                if (plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject)
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject[plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject.length] = propertiesObject;
                else
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject = [propertiesObject];
                break;
              case "compareDateWithDate":
                propertiesObject.startDate = parent.find("#startDate").val();
                propertiesObject.endDate = parent.find("#endDate").val();
                propertiesObject.limitationByType = {
                    bday: {
                        ADLT: ["#{messageMap['IBE_PR_WRK_ADLT_MIN_AGE']}", "#{messageMap['IBE_PR_WRK_ADLT_MAX_AGE']}"],
                        CHLD: ["#{messageMap['IBE_PR_WRK_CHLD_MIN_AGE']}", "#{messageMap['IBE_PR_WRK_CHLD_MAX_AGE']}"],
                        INFT: ["#{messageMap['IBE_PR_WRK_INFT_MIN_AGE']}", "#{messageMap['IBE_PR_WRK_INFT_MAX_AGE']}"],
                        ADLTST: ["#{messageMap['IBE_PR_WRK_ADLTST_MIN_AGE']}", "#{messageMap['IBE_PR_WRK_ADLTST_MAX_AGE']}"],
                        SLDR: ["#{messageMap['IBE_PR_WRK_SLDR_MIN_AGE']}", "#{messageMap['IBE_PR_WRK_SLDR_MAX_AGE']}"]
                    }
                };
                if (plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject)
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject[plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject.length] = propertiesObject;
                else
                  plugin.inputData[elementID][plugin.inputData[elementID].validationType].ruleObject = [propertiesObject];
                break;
            }
            break;
          case "searchObject":

            if (!validationObject) {
              plugin.inputData[elementID][plugin.inputData[elementID].validationType] = {}, validationObject = plugin.inputData[elementID][plugin.inputData[elementID].validationType];
            }

            if (!plugin.inputData[elementID].propertiesObject[elementTagName].parentTag) {
              alert("You must add a parent element to your input for displaying error message!");
              return false;
            }

            var propertiesObject = {},
            selectedFunction = parent.find("#validationFunction").val();
            propertiesObject[selectedFunction] = {};
            if (parent.find("#showLabel").is(":checked")) propertiesObject[selectedFunction].showLabel = true;
            if (parent.find("#visibility").is(":checked")) propertiesObject[selectedFunction].visibility = true;
            propertiesObject[selectedFunction].parentTag = plugin.inputData[elementID].propertiesObject[elementTagName].parentTag;
            propertiesObject[selectedFunction].eventType = "click";
            propertiesObject[selectedFunction].button = $("#submitButton").val();

            switch (parent.find("#validationFunction").val()) {
              case "checkbox":
                propertiesObject[selectedFunction].type = "Checkbox";
                break;
              case "empty":
                propertiesObject[selectedFunction].message = parent.find("#validationMessage").val() ? parent.find("#validationMessage").val():"notBeEmpty";
                break;
            }

            plugin.inputData[elementID][plugin.inputData[elementID].validationType] = propertiesObject;
            break;
        }

        plugin.objectForAllValidation = {addSearchObject:{},addValidationObject:{}};
        $.each(plugin.inputData, function(index, inputObject) {
          elementTagName = Object.keys(inputObject.propertiesObject)[0];
          if (inputObject.validationObject) {
            if (inputObject.validationObject.ruleObject) {
              $.each(inputObject.validationObject.ruleObject, function(objectIndex, inputRuleObject) {
                var newInputRuleObject = $.extend(true, {}, inputRuleObject);
                delete newInputRuleObject.button,
                delete newInputRuleObject.eventType;
                if (plugin.objectForAllValidation.addValidationObject[inputRuleObject.button]) {
                  if (plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType]) {
                    if (plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType][elementTagName]) {
                      plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType][elementTagName].ruleObject[plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType][elementTagName].ruleObject.length] = newInputRuleObject;
                    } else {
                      plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType][elementTagName] = {ruleObject: [newInputRuleObject]};
                    }
                  }
                  else {
                    plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType] = {};
                   plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType][elementTagName] = {ruleObject: [newInputRuleObject]};
                  }
                } else {
                  plugin.objectForAllValidation.addValidationObject[inputRuleObject.button] = {};
                  plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType] = {};
                  plugin.objectForAllValidation.addValidationObject[inputRuleObject.button][inputRuleObject.eventType][elementTagName] = {ruleObject: [newInputRuleObject]};
                }
              });
            } else {
              var newInputRuleObject = $.extend(true, {}, inputObject.validationObject);
              delete newInputRuleObject.button,
              delete newInputRuleObject.eventType;

              if (plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button]) {
                if (plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button][inputObject.validationObject.eventType]) {
                  plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button][inputObject.validationObject.eventType][elementTagName] = newInputRuleObject;
                }
                else {
                  plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button][inputObject.validationObject.eventType] =  {};
                  plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button][inputObject.validationObject.eventType][elementTagName] = newInputRuleObject;
                }
              } else {
                plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button] = {};
                plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button][inputObject.validationObject.eventType] = {};
                plugin.objectForAllValidation.addValidationObject[inputObject.validationObject.button][inputObject.validationObject.eventType][elementTagName] = newInputRuleObject;
              }
            }
          }
          if (inputObject.searchObject) {
            $.each(inputObject.searchObject, function(objectIndex, inputRuleObject) {
              var newInputRuleObject = $.extend(true, {}, inputRuleObject);
              delete newInputRuleObject.button,
              delete newInputRuleObject.eventType;

              if (plugin.objectForAllValidation.addSearchObject[inputRuleObject.button]) {
                if (plugin.objectForAllValidation.addSearchObject[inputRuleObject.button][objectIndex]) {
                  plugin.objectForAllValidation.addSearchObject[inputRuleObject.button][objectIndex][elementTagName] = newInputRuleObject;
                } else {
                  plugin.objectForAllValidation.addSearchObject[inputRuleObject.button][objectIndex] = {};
                  plugin.objectForAllValidation.addSearchObject[inputRuleObject.button][objectIndex][elementTagName] = newInputRuleObject;
                }
              } else {
                plugin.objectForAllValidation.addSearchObject[inputRuleObject.button] = {};
                plugin.objectForAllValidation.addSearchObject[inputRuleObject.button][objectIndex] = {};
                plugin.objectForAllValidation.addSearchObject[inputRuleObject.button][objectIndex][elementTagName] = newInputRuleObject;
              }
            });
          }
        });

        if (!$(".object").is(".created")) {

          $(".object").append($("<div/>", {class: "validation__object"}));

          $("<div class='documentHead'/>").appendTo($(".validation__object"));
          $(".documentHead").html("$(document).on(\"ready\", function() {");

          $("<div class='mainValidator'/>").appendTo($(".validation__object"));
          $(".mainValidator").html("<br />" + "&nbsp;&nbsp;var validate = new validator();");

          $("<div class='validationObject'/>").appendTo($(".validation__object"));

          $("<div class='documentBottom'/>").appendTo($(".validation__object"));
          $(".documentBottom").html("});");

          $("<div/>", {class: "remove__this button", html: "Reset Object"}).appendTo($(".validation__object"));

        }

        $(".object").addClass("created");

        $(".validationObject").html("");
        var buttons = {};
        $.each(plugin.objectForAllValidation, function(index, validationFunctions) {
          $.each(validationFunctions, function(id, object) {
            $(".validationObject").html($(".validationObject").html() + "<br/>" + "&nbsp;&nbsp;validate." + index + "(\"" + id + "\", ");
            var jsonStr = JSON.stringify(object),
              regeStr = '',
              f = {
                brace: 2
              };

            regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*|])/g, function(m, p1) {
              var rtnFn = function() {
                  if(/\"rule"/g.test(p1))
                    if (/\",/g.test(p1))
                      p1 = p1.replace(/\:"/g, ": ").replace(/\",/g, ",");
                    else
                      p1 = p1+",", p1 = p1.replace(/\:"/g, ": ").replace(/\",/g, ",");
                  return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
                },
                rtnStr = 0;
              if (p1.lastIndexOf('{') === (p1.length - 1)) {
                rtnStr = rtnFn();
                f['brace'] += 1;
              } else if (p1.indexOf('}') === 0) {
                f['brace'] -= 1;
                rtnStr = rtnFn();
              } else {
                rtnStr = rtnFn();
              }
              return rtnStr;
            });

            $(".validationObject").html($(".validationObject").html() + regeStr + "&nbsp;&nbsp;);");
            buttons[id] = true;
          });
        });

        $.each(buttons, function(element, value) {
          $(".validationObject").html($(".validationObject").html() + "<br/>&nbsp;&nbsp;" + "validate.validate(" + "\"click\", " +" \"" + element + "\"" + ($(element).next().next().find("#checkMain").is(":checked") ? ", \"main\"":"") + ");");
        });

        var triggerType = $(
          "<div class='input__parent'><label>How you want to trigger validation?</label><select id='triggerType'><option value='click'>Click</option><option value='keyup'>Keyup</option><option value='keypress'>Keypress</option><option value='keydown'>Keydown</option><option value='button'>On button click</option></select></div>"
        );
      },
      functionObject: {
        "empty": {
          message: "Check If Empty",
          rules: {message: true, visibility: true, showLabel: true}
        },
        "checkbox": {
          message: "Check Checkbox",
          rules: {visibility: true}
        },
        "checkCounts": {
          message: "Check Counts",
          rules: {elements: 3,message:true,visibility:true}
        },
        "checkEmail": {
          message: "Check Email",
          rules: {elements:1,message:true,visibility:true}
        },
        "checkForSelected": {
          message: "Check For Selected",
          rules: {selectedItem: true,selectedItemParent: true,notSelectedItem: true,message:true,visibility:true}
        },
        "checkID": {
          message: "Check National ID",
          rules: {elements: 1,message:true,visibility:true,natIDType:["TR","IR"]}
        },
        "checkIfSame": {
          message: "Check If Same",
          rules: {elements:2,message:true,visibility:true,checkType: ["default", "password"]}
        },
        "checkPhone": {
          message: "Check Phone",
          rules: {elements:1,message:true,visibility:true}
        },
        "compareDateWithDate": {
          message: "Compare Date With Today",
          rules: {startDate: true,endDate: true,message:true,visibility:true}
        }
      },
    };

    var editor = new HTMLtoVALIDATION();
    var validate = new validator();
    $(document).on("click", "#htmlinputok", function() {
      editor.createInputs($("#htmlinput").val());
    });

    $(document).on("change", "#validationFunction", function() {
      switch ($(this).val()) {
        case "checkbox":
        case "empty":
          editor.inputData[$(this).parent().parent().data("element")].validationType = "searchObject";
          break;
        default:
          editor.inputData[$(this).parent().parent().data("element")].validationType = "validationObject";
          break;
      }
      editor.fillSettings(this);
    });

    $(document).on("click", ".settings #activateValidation", function() {
      editor.createValidationObject(this);
    });

    $(document).on("click", "#buttoninputok", function() {
      editor.createButtons($("#buttoninput").val());
    });

    $(document).on("click", ".remove__this", function() {
      editor.removeElement(this);
    });

    $(document).on("click", ".tab__button", function() {
      $(".tab__button").removeClass("active");
      $(this).addClass("active");
      $(".HTMLtoVALIDATION").removeClass("active");
      $(".HTMLtoVALIDATION[data-element='" + $(this).data("element") + "']").addClass("active");
    });

    $(document).on("click", ".start__validation", function() {
      eval($(".mainValidator").text() + $(".validationObject").text());
    });

});
