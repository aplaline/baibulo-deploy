$(document).ready(function() {
  $.get("http://localhost:3000/api/data", function(data) { console.log(data.message); });
});
