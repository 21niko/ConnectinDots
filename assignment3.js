
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;

// Locations of the dots
var dot_locations = 
[[490,89], [537,92], [613,67], [640,127], [592,161], [661,274], [584,272], [550,282], [558,308], [592,309], [578,346], [545,340], [521,412], [584,420], [575,458], [499,437], [433,470], [477,482], [463,515], [326,429], [143,424], [109,448], [175,479], [104,477], [80,442], [117,407], [311,397], [353,319], [448,217], [447,191], [383,123], [436,69]];


document.addEventListener('DOMContentLoaded', function() {
let canvas_obj = document.getElementById("canvas");

let ctx = canvas_obj.getContext("2d");
let min_x = Number.MAX_SAFE_INTEGER;
let min_y = Number.MAX_SAFE_INTEGER;
let high_point_idx = 0;
// find the minimum x, to be used as x-zero
// Also find the topmost dot to find where to start drawing from
for (let idx = 0; idx 
< dot_locations.length; ++idx) {
                       if (min_x > dot_locations[idx][0])
  min_x = dot_locations[idx][0];
  if (min_y > dot_locations[idx][1]) {
  min_y = dot_locations[idx][1];
  high_point_idx = idx;
  }
  }
  drawDots(ctx, min_x);
  // line joining the dots with a width of 7
  ctx.lineWidth = 7;
  let timeouts = []
  document.getElementById("ctrl_btn").addEventListener("click", function(event) {
  if (event.target.innerText === "Begin Animation") {
  event.target.innerText = "Stop Animation";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawDots(ctx, min_x);
  for (let idx = 0; idx 
  < dot_locations.length; ++idx) {
                         // wait three seconds before drawing the line
                         timeouts.push(setTimeout(function() {
                         let rel_idx_start = (high_point_idx + idx) % dot_locations.length;
                         let rel_idx_end = (high_point_idx + idx + 1) % dot_locations.length;
                         joinDots(ctx, [dot_locations[rel_idx_start][0] - min_x + 7, dot_locations[rel_idx_start][1]],
                         [dot_locations[rel_idx_end][0] - min_x + 7, dot_locations[rel_idx_end][1]]);
                         if (idx === dot_locations.length - 1)
                         shiftCanvas(ctx, dot_locations, timeouts, min_x);
                         }, 3000 * idx));
                         }
                         }
                         else {
                         event.target.innerText = "Begin Animation";
                         for (var i = 0; i 
                         < timeouts.length; i++)
  clearTimeout(timeouts[i]);
  timeouts = [];
  }
  });
  });
  function drawDots(ctx, min_x, shift=0) {
  // Plot each dot on the canvas
  for (let idx = 0; idx 
  < dot_locations.length; ++idx) {
                         // new x for the point is shifted by min_x and with 7 added as per the requirement
                         let shifted_point = [dot_locations[idx][0] - min_x + 7 + shift, dot_locations[idx][1]];
                         drawDot(ctx, shifted_point);
                         }
                         }
                         // Draw a single dot
                         function drawDot(ctx, loc) {
                         ctx.beginPath();
                         ctx.arc(loc[0], loc[1], 7, 0, 2 * Math.PI);
                         ctx.fill();
                         }
                         // Draw a line between the dots
                         function joinDots(ctx, loc_from, loc_to, shift2=0) {
                         console.log(shift2);
                         // construct the stroke with gradient for line joining the dots
                         let grad= ctx.createLinearGradient(loc_from[0] + shift2, loc_from[1], loc_to[0] + shift2, loc_to[1]);
                         grad.addColorStop(0, "blue");
                         grad.addColorStop(0.5, "red");
                         grad.addColorStop(1.0, "yellow");
                         ctx.strokeStyle = grad;
                         ctx.beginPath();
                         ctx.moveTo(loc_from[0] + shift2, loc_from[1]);
                         ctx.lineTo(loc_to[0] + shift2, loc_to[1]);
                         ctx.stroke();
                         }
                         // shift canvas contents by 4 pixels to the right
                         function shiftCanvas(ctx, dot_locations, timeouts, min_x) {
                         // find the right most point, using x-co-ordinates of all the points
                         // this will be used to detect if the contents reached the right edge
                         let max_x = 0;
                         for (let idx = 0; idx 
                         < dot_locations.length; ++idx) {
  if (max_x 
  < dot_locations[idx][0])
                          max_x = dot_locations[idx][0];
                          }
                          let can_width = ctx.canvas.width;
                          // keep shifting by 4 pixels until figure hits right edge
                          // here min_x was used because the points are intially shifted, it makes up for that correction
                          // and 11 compensates for 4 px border on either side + 7 px radius of the dot
                          for (let idx = 0; max_x - min_x + 11 
                          < can_width; ++idx, max_x += 4) {
  timeouts.push(setTimeout(function() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawDots(ctx, min_x, 4*idx);
  for (let idx2 = 0; idx2 
  <= dot_locations.length; ++idx2) {
                         let end = (idx2 + 1) % dot_locations.length;
                         joinDots(ctx, [dot_locations[idx2][0] - min_x + 7, dot_locations[idx2][1]], 
                         [dot_locations[end][0] - min_x + 7, dot_locations[end][1]], 4*idx);
                         }
                         }, 30 * idx));
                         }}
