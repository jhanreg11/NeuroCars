var pl = planck
var segments = [[[45, 55], [0, 10]], [[0, 10], [-20, 10]], [[-20, 10], [-40, 35]],
  [[-40, 35], [-60, 15]], [[-60, 15], [-50, 0]], [[-50, 0], [-50, -20]], [[-50, -20], [-60, -30]],
  [[-60, -30], [-60, -60]], [[-60, -60], [-50, -60]], [[-50, -60], [-50, -30]], [[-50, -30], [-40, -20]],
  [[-40, -20], [-40, 0]], [[-40, 0], [-50, 15]], [[-50, 15], [-40, 25]], [[-40, 25], [-20, 0]], [[-20, 0], [0, 0]],
  [[0, 0], [50, 50]]]

var goals = [[[-50, -45], [-60, -45]], [[-50, -30], [-60, -30]], [[-45, -25], [-55, -25]], [[-40, -20], [-50, -20]],
  [[-40, -10], [-50, -10]], [[-40, 0], [-50, 0]], [[-45, 10], [-57, 10]], [[-50, 15], [-60, 15]],
  [[-45, 20], [-55, 20]], [[-42, 23], [-48, 27]], [[-40, 25], [-40, 35]], [[-36, 20], [-32, 25]],
  [[-32, 15], [-29, 22]], [[-28, 10], [-23, 15]], [[-20, 0], [-20, 10]], [[-10, 0], [-10, 10]], [[0, 0], [0, 10]],
  [[10, 10], [6, 16]], [[15, 15], [10, 20]], [[25, 25], [20, 30]], [[35, 35], [30, 40]], [[45, 45], [40, 50]]]
planck.testbed(function(testbed) {
  var world = pl.World()
  var track = new Track(world, segments, goals, pl.Vec2(-55, -50), 200)

  testbed.width = 200
  testbed.height = 200

  testbed.step = function() {
    for (var i = 0; i < track.cars.length; ++i) {
      track.cars[i].getLocation(testbed, false)
      track.cars[i].update(Math.floor(Math.random() * 3 - 1), Math.floor(Math.random() * 3 - 1))
    }
    // if (cp.x > testbed.x + 10)
    //   testbed.x = cp.x - 10
    // else if (cp.x < testbed.x - 10)
    //   testbed.x = cp.x + 10
    // if (cp.y > testbed.y + 10)
    //   testbed.y = cp.y - 10
    // else if (cp.y < testbed.y - 10)
    //   testbed.y = cp.y + 10
  }

  return world
})

// var world = planck.World()
// var car = new Car(world, planck.Vec2(0, 0))
// var accel = 0
// var turn = 0
// function setup() {
//
// }
//
// function draw() {
//   world.step(1.0/60)
//   car.update(accel, turn)
//   car.draw()
// }
//
// function keyPressed() {
//   console.log('hi')
//   if (keyCode == UP_ARROW)
//     accel = 1
//   else if (keyCode == DOWN_ARROW)
//     accel = -1
//   else if (keyCode == LEFT_ARROW)
//     turn = 1
//   else if (keyCode == RIGHT_ARROW)
//     turn = -1
// }
//
// function keyReleased() {
//   if (keyCode == UP_ARROW || keyCode == DOWN_ARROW)
//     accel = 0
//   else if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW)
//     turn = 0
// }
