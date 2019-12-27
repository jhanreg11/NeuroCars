var pl = planck
var segments = [[[45, 55], [0, 10]], [[0, 10], [-20, 10]], [[-20, 10], [-40, 35]],
  [[-40, 35], [-60, 15]], [[-60, 15], [-50, 0]], [[-50, 0], [-50, -20]], [[-50, -20], [-60, -30]],
  [[-60, -30], [-60, -60]], [[-60, -60], [-50, -60]], [[-50, -60], [-50, -30]], [[-50, -30], [-40, -20]],
  [[-40, -20], [-40, 0]], [[-40, 0], [-50, 15]], [[-50, 15], [-40, 25]], [[-40, 25], [-20, 0]], [[-20, 0], [0, 0]],
  [[0, 0], [50, 50]]]

var goals = [[[-50, -45], [-60, -45]], [[-50, -40], [-60, -40]], [[-50, -35],[-60, -35]], [[-50, -30], [-60, -30]], [[-45, -25], [-55, -25]], [[-40, -20], [-50, -20]],
  [[-40, -10], [-50, -10]], [[-40, 0], [-50, 0]], [[-45, 10], [-57, 10]], [[-50, 15], [-60, 15]],
  [[-45, 20], [-55, 20]], [[-42, 23], [-48, 27]], [[-40, 25], [-40, 35]], [[-36, 20], [-32, 25]],
  [[-32, 15], [-29, 22]], [[-28, 10], [-23, 15]], [[-20, 0], [-20, 10]], [[-10, 0], [-10, 10]], [[0, 0], [0, 10]],
  [[10, 10], [6, 16]], [[15, 15], [10, 20]], [[25, 25], [20, 30]], [[35, 35], [30, 40]], [[45, 45], [40, 50]]]


planck.testbed(function(testbed) {
  var stepCount = 0
  var iterations = 0
  var popSeed = []
  var noMoreSeed = false
  var pause = false
  var world = pl.World()
  var track = new Track(world, segments, goals, pl.Vec2(-55, -50), 150)
  var population = new Population(150, .15)
  track.setAgents(population.population)
  testbed.width = 150
  testbed.height = 150

  testbed.step = function() {
    if (pause) return
    // stepCount++
    let decision
    let location
    let generateNewPop = true
    for (var i = 0; i < track.cars.length; ++i) {
      location = track.cars[i].getLocation(testbed, false)
      decision = track.cars[i].agent.genAction(location, track.cars[i].body.getLinearVelocity().length())
      track.cars[i].update(1, decision.turn)
      if (track.cars[i].agent.alive)
        generateNewPop = false
    }

    if (generateNewPop || stepCount > 300) {
      // iterations++
      // if (popSeed.length < 100) {
      //   population.evaulatePopulation()
      //   for (var i = 0; i < 5; ++i)
      //     popSeed.push(population.population[i])
      //   population.newRandomPopulation()
      // }
      // if (popSeed.length == 100) {
      //   population.population = popSeed
      //   noMoreSeed = true
      // }
      // if (noMoreSeed)
      population.newPopulation()
      track.setAgents(population.population)
      stepCount = 0
    }
  }

  return world
})
