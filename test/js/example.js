$(document).ready(function() {
  var validate = new validator();

  /*////////////////////////////////////////////
  /////////// Email Input Validation //////////
  ///////////////////////////////////////////*/
  validate.addSearchObject("#email-submit", {
    "empty": {
      "#email-1": {
        parentTag: ".form-group",
        message: "notBeEmpty",
        type: "Label",
        showLabel: true
      }
    }
  });

  validate.addValidationObject("#email-submit", {
    keyup: {
      "#email-1": {
        rule: validate.checkEmail,
        parentTag: ".form-group",
        message: "Please type email correctly!"
      }
    }
  });

  validate.validate("click", "#email-submit");

  /*////////////////////////////////////////////
  ////////// Password Inputs Validation ////////
  ///////////////////////////////////////////*/
  validate.addValidationObject("#password-submit", {
    keyup: {
      "#password-1, #password-2": {
        ruleObject: [{
          rule: validate.checkIfSame,
          elements: ["#password-1", "#password-2"],
          parentTag: ".form-group",
          message: "Please type same password!"
        }]
      }
    }
  });

  validate.validate("click", "#password-submit");

  /*////////////////////////////////////////////
  ///////////// Checkbox Validation ///////////
  ///////////////////////////////////////////*/
  validate.addSearchObject("#checkbox-submit", {
    "checkbox": {
      "#checkbox-1": {
        parentTag: ".form-group"
      }
    }
  });

  validate.validate("click", "#checkbox-submit");

  /*////////////////////////////////////////////
  /////////// Basic Form Validation ///////////
  ///////////////////////////////////////////*/
  validate.searchObj.main.html.label.parentTag = ".form-group";

  validate.addSearchObject("#basic-form-submit", {
    "checkbox": {
      "#basic-checkbox-1": {
        parentTag: ".form-group"
      }
    }
  });

  validate.validate("click", "#basic-form-submit", "main");

  /*////////////////////////////////////////////
  /////////// Date Inputs Validation //////////
  ///////////////////////////////////////////*/
  validate.addValidationObject("#compare-dates-submit", {
    change: {
      "#date-input-1": {
        ruleObject: [{
          rule: validate.compareDateWithDate,
          checkDate: new Date(),
          parentTag: ".form-group",
          message: "Please select today!"
        }]
      },
      "#date-input-2": {
        ruleObject: [{
          rule: validate.compareDateWithDate,
          checkDate: new Date(),
          limitation: {
            limitStart: 12,
            limitEnd: 100
          },
          message: {
            limitStart: "Adult age must be bigger than 12!",
            limitEnd: "Adult age must be smaller than 100!"
          },
          parentTag: ".form-group"
        }]
      },
      "#date-input-4": {
        ruleObject: [{
          rule: validate.compareDateWithDate,
          checkInput: "#date-input-3",
          message: "Please confirm date correctly!",
          parentTag: ".form-group"
        }]
      }
    }
  });

  validate.validate("click", "#compare-dates-submit");

  /*////////////////////////////////////////////
  //////// Check For Selected Validation //////
  ///////////////////////////////////////////*/
  validate.addValidationObject("#check-for-selected-submit", {
    click: {
      "#check-for-selected-submit": {
        ruleObject: [{
          rule: validate.checkForSelected,
          selectedItemParent: "#item-list",
          selectedItem: "li",
          placeErrorTo: "#item-list",
          parentTag: ".form-group",
          message: "You must add a item to list!"
        }]
      }
    }
  });

  validate.validate("click", "#check-for-selected-submit");
});
