var pl = planck

const collisionCategories = {
  car: 0x0001,
  wall: 0x0002,
  goal: 0x0003,
  ray: 0x0004
}

const tracks = [
  {
    id: 0,
    walls: [[[45, 55], [0, 10]], [[0, 10], [-20, 10]], [[-20, 10], [-40, 40]],
    [[-40, 40], [-60, 15]], [[-60, 15], [-50, 0]], [[-50, 0], [-50, -20]], [[-50, -20], [-60, -30]],
    [[-60, -30], [-60, -60]], [[-60, -60], [-50, -60]], [[-50, -60], [-50, -30]], [[-50, -30], [-40, -20]],
    [[-40, -20], [-40, 0]], [[-40, 0], [-50, 15]], [[-50, 15], [-40, 25]], [[-40, 25], [-20, 0]], [[-20, 0], [0, 0]],
    [[0, 0], [50, 50]]],
    checkpoints: [[[45, 45], [40, 50]]],
    startPoint: pl.Vec2(-55, -50),
    startAngle: 0
  },
  {
    id: 1,
    walls: [[[60, -20], [60, 0]], [[60, 0], [43.8, 25.3]], [[43.8, 25.3], [24.5, 29.3]], [[24.5, 29.3], [39.6, 0]],
      [[39.6, 0], [14.6, -53.2]], [[14.6, -53.2], [-2.2, -21.2]], [[-2.2, -21.2], [-1.7, -7.2]],
      [[-1.7, -7.2], [-28.8, -7.5]], [[-28.8, -7.5], [-29, 20]], [[-29, 20], [-30, 25.3]], [[-30, 25.3], [-55, 14.4]],
      [[-55, 14.4], [-68.2, -7.5]], [[-68.2, -7.5], [-59.7, -10.8]], [[-59.7, -10.8], [-40.1, -5.1]],
      [[-40.1, -5.1], [-10, -20]], [[-10, -20], [-10, -35]], [[-10, -35], [-20, -35]], [[-20, -35], [-20, -25]],
      [[-20, -25], [-40, -15]], [[-40, -15], [-60, -20.1]], [[-60, -20.1], [-79.9, -10.5]],
      [[-79.9, -10.5], [-59.7, 20.6]], [[-59.7, 20.6], [-20, 40]], [[-20, 40], [-17.5, 20]], [[-17.5, 20], [-15.6, 2.7]],
      [[-15.6, 2.7], [6.8, 2.7]], [[6.8, 2.7], [7.3, -21]], [[7.3, -21], [14.3, -35.8]], [[14.3, -35.8], [29, 0]],
      [[29, 0], [13.1, 39.2]], [[13.1, 39.2], [50.2, 32.4]], [[50.2, 32.4], [70, 0]], [[70, 0], [70, -20]]],
    checkpoints: [[[70, -20], [60, -20]]],
    startPoint: pl.Vec2(-15, -30),
    startAngle: 0,
  },
]

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

class Track {
  constructor(world, walls, checkpoints, startPoint, startAngle, carNum) {
    if (typeof startPoint == 'undefined') {
      let i = walls
      carNum = checkpoints
      walls = tracks[i].walls
      checkpoints = tracks[i].checkpoints
      startPoint = tracks[i].startPoint
      startAngle = tracks[i].startAngle
    }
    else if (typeof carNum == 'undefined') {
      carNum = startAngle
      startAngle = 0
    }
    this.world = world
    this.walls = new Walls(world, walls)
    this.checkpoints = new Checkpoints(world, checkpoints)
    this.cars = Array.from({length: carNum}, () => new Car(world, startPoint, startAngle))
    this.startPoint = startPoint
    this.startAngle = startAngle

    // walls event listener
    world.on('pre-solve', function (contact, oldManifold) {
      var manifold = contact.getManifold()
      if (manifold.pointCount == 0)
        return

      var fixtureA = contact.getFixtureA()
      var fixtureB = contact.getFixtureB()
      var categoryA = fixtureA.getFilterCategoryBits()
      var categoryB = fixtureB.getFilterCategoryBits()
      if (categoryA == collisionCategories.car && categoryB == collisionCategories.wall)
        fixtureA.getBody().getUserData().kill()
      else if (categoryB == collisionCategories.car && categoryA == collisionCategories.wall)
        fixtureB.getBody().getUserData().kill()
    })

    // goal event listeners
    world.on('begin-contact', function(contact, oldManifold) {
      var fixtureA = contact.getFixtureA()
      var fixtureB = contact.getFixtureB()
      var categoryA = fixtureA.getFilterCategoryBits()
      var categoryB = fixtureB.getFilterCategoryBits()

      if (categoryA == collisionCategories.car && categoryB == collisionCategories.goal) {
        updateUI('#status', 'Completed!')
        console.log(canAlert)
				if (canAlert) {
				  var nn = fixtureA.getBody().getUserData().agent.brain.serialize()
          download(nn, 'fullytrain.txt', 'text/plain')
				  alert('Goal completed!')
					canAlert = false
        }
        // var nn = fixtureA.getBody().getUserData().agent.brain.serialize()
        // download(nn, 'fullytrain.txt', 'text/plain')
        // fixtureA.getBody().getUserData().updateFitness(fixtureB.getBody())
      }
      else if (categoryB == collisionCategories.car && categoryA == collisionCategories.goal) {
        console.log(canAlert)
        updateUI('#status', 'Completed!')
        if (canAlert) {
          var nn = fixtureB.getBody().getUserData().agent.brain.serialize()
          download(nn, 'fullytrain.txt', 'text/plain')
				  alert('Goal completed!')
					canAlert = false
        }
        // var nn = fixtureB.getBody().getUserData().agent.brain.serialize()
        // download(nn, 'fullytrain.txt', 'text/plain')
        // fixtureB.getBody().getUserData().updateFitness(fixtureA.getBody())
      }
    })

  }

  setAgents(agents) {
    // var world = this.walls.body.getWorld()
    // if (this.cars != null)
    //   this.cars.forEach((car) => world.destroyBody(car.body))
    for (var i = 0; i < agents.length; ++i) {
      this.cars[i].body.setPosition(this.startPoint)
      this.cars[i].body.setAngle(this.startAngle)
      this.cars[i].agent = agents[i]
      this.cars[i].body.setAwake(true)
    }
  }
  destroyBodies() {
    this.world.destroyBody(this.walls.body)
    let world = this.world
    this.checkpoints.bodies.forEach(function(body) {
      world.destroyBody(body)
    })
    this.cars.forEach(function(car) {
      world.destroyBody(car.body)
    })
  }

  addCars(num) {
    for (var i = 0; i < num; ++i)
      this.cars.push(new Car(this.world, this.startPoint, this.startAngle))
  }

  deleteCars(num) {
    for (var i = 0; i < num; ++i)
      this.world.destroyBody(this.cars[i].body)
    this.cars.splice(0, num)
  }

  moveCarsToStart() {
    let startPoint = this.startPoint
    let startAngle = this.startAngle
    this.cars.forEach(function(car) {
      car.body.setPosition(startPoint)
      car.body.setAngle(startAngle)
      car.goalsHit = 0
    })
  }

}
