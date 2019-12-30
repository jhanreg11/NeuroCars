var pl = planck

var black = {fill: 'black', stroke: 'white'}

var simulation = new Simulation(0, 150, .15)

pl.testbed(function(testbed) {
  testbed.background = '#BFBDC1'
  testbed.ratio = 5
  testbed.width = 150
  testbed.height = 150
	testbed.lineWidth = 1000
  testbed.step = function() {
    simulation.update()
  }
  return simulation.world
})
