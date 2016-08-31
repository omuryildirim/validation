$(document).ready(function() {

  $("body").validation();

  $("#form1").validation({
    "empty": {
      "#basicFormName": true
    },
    "email": {
      "#basicFormEmail": {
        message: "Please type correct email!",
        "eventType": "keydown"
      }
    },
    "same": {
      "#basicFormPassword": {
        other: "#basicFormPasswordReType"
      }
    },
    "control": {
      "#basicFormEmail": true,
      "#basicFormPassword": true,
      "#basicFormPasswordReType": true
    }
  });
  
});
