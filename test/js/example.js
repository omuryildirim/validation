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
  ///////////// Checkbox Validation ///////////
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
});
