/** Class representing all track/physics simulations */
class Track {
  /**
   * Create a track.
   * @param {pl.World} world - planck world for track to defined in.
   * @param {Array | Number} walls - list of line segments representing track walls (see trackInfo.js for array structure).
   * OR index representing which track object to get information from.
   * @param {Array} goals - list of line segments representing track goal(s) (see trackInfo.js for array structure).
   * @param {pl.Vec2} startPoint - start point of track.
   * @param {Number} startAngle - starting angle in radians.
   * @param {Number} carNum - number of cars in track.
   */
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

      if ((categoryA == collisionCategories.car && categoryB == collisionCategories.goal)
        || (categoryB == collisionCategories.car && categoryA == collisionCategories.goal)) {
        updateUI('#status', 'Completed!')
				if (canAlert) {
				  alert('Goal completed!')
					canAlert = false
        }
      }
    })
  }

  /**
   * Assign agent to each of tracks car and reset cars to start.
   * @param {Array} agents - list of agents to be assigned.
   */
  setAgents(agents) {
    for (var i = 0; i < agents.length; ++i)
      this.cars[i].agent = agents[i]

    this.moveCarsToStart()
  }

  /**
   * Destroy all planck bodies from this.world.
   */
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

  /**
   * Add cars to track.
   * @param {Number} num - number of cars to add.
   */
  addCars(num) {
    for (var i = 0; i < num; ++i)
      this.cars.push(new Car(this.world, this.startPoint, this.startAngle))
  }

  /**
   * Delete cars from track.
   * @param {Number} num -  number of cars to delete.
   */
  deleteCars(num) {
    for (var i = 0; i < num; ++i)
      this.world.destroyBody(this.cars[i].body)
    this.cars.splice(0, num)
  }

  /**
   * Move all cars to start.
   */
  moveCarsToStart() {
    let startPoint = this.startPoint
    let startAngle = this.startAngle
    this.cars.forEach(function(car) {
      car.body.setPosition(startPoint)
      car.body.setAngle(startAngle)
      car.body.setAwake(true)
    })
  }

}
