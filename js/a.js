var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
 context.strokeStyle = "#ddd";
 
for (var x = 0.5; x < 600; x += 10) {
  context.moveTo(x, 0);
  context.lineTo(x, 400);
}
for (var y = 0.5; y < 400; y += 10) {
  context.moveTo(0, y);
  context.lineTo(600, y);
}
context.stroke();