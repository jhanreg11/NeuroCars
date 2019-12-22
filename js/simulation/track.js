var pl = planck

const collisionCategories = {
  car: 0x0001,
  wall: 0x0002,
  goal: 0x0003,
  ray: 0x0004
}

class Track {
  constructor(world, walls, checkpoints, startPoint, carNum) {
    this.walls = new Walls(world, walls)
    this.checkpoints = new Checkpoints(world, checkpoints)
    this.cars = Array.from({length: carNum}, () => new Car(world, startPoint))
    this.startPoint = startPoint

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

      if (categoryA == collisionCategories.car && categoryB == collisionCategories.goal)
        fixtureA.getBody().getUserData().updateFitness(fixtureB.getBody())
      else if (categoryB == collisionCategories.car && categoryA == collisionCategories.goal)
        fixtureB.getBody().getUserData().updateFitness(fixtureA.getBody())
    })

  }

  setAgents(agents) {
    // var world = this.walls.body.getWorld()
    // if (this.cars != null)
    //   this.cars.forEach((car) => world.destroyBody(car.body))
    for (var i = 0; i < agents.length; ++i) {
      this.cars[i].body.setPosition(this.startPoint)
      this.cars[i].agent = agents[i]
      this.cars[i].body.setAwake(true)
    }
  }

}
