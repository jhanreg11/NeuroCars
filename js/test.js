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

var stepCount = 0
planck.testbed(function(testbed) {
  var world = pl.World()
  var track = new Track(world, segments, goals, pl.Vec2(-55, -50), 100)
  var population = new Population(100, .15)
  track.setAgents(population.population)
  testbed.width = 200
  testbed.height = 200

  testbed.step = function() {
    stepCount++
    let decision
    let location
    let generateNewPop = true
    for (var i = 0; i < track.cars.length; ++i) {
      location = track.cars[i].getLocation(testbed, false)
      decision = track.cars[i].agent.genAction(location, track.cars[i].body.getLinearVelocity().length())
      track.cars[i].update(decision.accel, decision.turn)
      if (track.cars[i].agent.alive)
        generateNewPop = false
    }

    if (generateNewPop || stepCount > 600) {
      console.log('starting new turn')
      population.newPopulation()
      console.log('finishing generating new population')
      track.setAgents(population.population)
      console.log('finished resetting cars')
      stepCount = 0
    }
  }

  return world
})
