var pl = planck

var simulation = new Simulation(0, 150, .15)
var popSize
planck.testbed(function(testbed) {
  testbed.debug = true
  testbed.width = 150
  testbed.height = 150
	testbed.lineWidth = 1000
  testbed.step = function() {
    simulation.update()
  }
  return simulation.world
})
