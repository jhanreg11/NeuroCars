var pl = planck

const ppu = 50

const carConfig = {
  maxForwardSpeed: 10,
  maxBackwardSpeed: -20,
  maxDriveForce: 500,
  maxLateralImpulse: 1,
  torque: 10,
  length: 2.5,
  width: 1.25,
  rayLength: 20
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Car {
  constructor(world, position, angle) {
    if (typeof angle == 'undefined')
      angle = 0

    var carShapeDef = {
      filterCategoryBits: collisionCategories.car,
      filterMaskBits: collisionCategories.wall,
      density: 1
    }

    this.agent = null
    this.body = world.createDynamicBody({userData: this,  position: position, angle: angle})
    this.body.createFixture(pl.Box(carConfig.width, carConfig.length), carShapeDef)
    this.goalsHit = 0
    this.body.render = {fill: getRandomColor(), stroke: '#000000', width: '10px'}
  }

  getLateralVelocity() {
    var rightNorm = this.body.getWorldVector(pl.Vec2(1, 0))
    return rightNorm.mul(pl.Vec2.dot(rightNorm, this.body.getLinearVelocity()))
  }

  getForwardVelocity() {
    var forwardNorm = this.body.getWorldVector(pl.Vec2(0, 1))
    return forwardNorm.mul(pl.Vec2.dot(forwardNorm, this.body.getLinearVelocity()))
  }

  updateFriction() {
    // kill lateral velocity
    var impulse = this.getLateralVelocity().mul(-this.body.getMass())
    // if (impulse.length() > carConfig.maxLateralImpulse)
    //   impulse.mul(carConfig.maxLateralImpulse / impulse.length())
    this.body.applyLinearImpulse(impulse, this.body.getWorldCenter())

    // kill angular velocity
    this.body.applyAngularImpulse(.1 * this.body.getInertia() * -this.body.getAngularVelocity())

    // apply drag
    var forwardNormal = this.getForwardVelocity()
    var forwardSpeed = forwardNormal.normalize()
    var dragMagnitude = -2 * forwardSpeed
    this.body.applyForce(forwardNormal.mul(dragMagnitude), this.body.getWorldCenter())
  }

  updateDrive(accel) {
    // console.log('pressing gas')
    // find desired speed
    var desiredSpeed = 0
    switch(accel) {
      case 1: desiredSpeed = carConfig.maxForwardSpeed; break;
      case -1: desiredSpeed = carConfig.maxBackwardSpeed; break;
      default: return
    }

    // find current forward speed
    var forwardNorm = this.body.getWorldVector(pl.Vec2(0, 1))
    var currSpeed = pl.Vec2.dot(this.getForwardVelocity(), forwardNorm)

    // apply necessary force
    var force = 0
    if (desiredSpeed > currSpeed)
      force = carConfig.maxDriveForce
    else if (desiredSpeed < currSpeed)
      force = -carConfig.maxDriveForce
    else
      return

    this.body.applyForce(forwardNorm.mul(force), this.body.getWorldCenter())
  }

  updateTurn(angle) {
    // console.log('turning')
    // find desired torque
    if (this.body.getLinearVelocity().length() == 0)
      return
    var desiredTorque = 0
    switch (angle) {
      case 1: desiredTorque = carConfig.torque; break;
      case -1: desiredTorque = -carConfig.torque; break;
      default: return
    }

    // turn tire
    // this.body.setAngle(this.body.getAngle() + desiredTorque)
    this.body.applyAngularImpulse(desiredTorque)
  }

  update(accel, turn) {
    this.updateDrive(accel)
    this.updateTurn(turn)
    this.updateFriction()
  }

  getLocation(testbed, draw) {
    let locations = new Array(5)
    let point1 = pl.Vec2(this.body.getPosition())
    point1.add(this.body.getWorldVector(pl.Vec2(0, 1)).mul(carConfig.length))
    let point2
    let currAngle = this.body.getAngle()
    let x
    let y
    for (let i = 0; i < locations.length; ++i) {
      x = point1.x - carConfig.rayLength * Math.cos(currAngle)
      y = point1.y - carConfig.rayLength *  Math.sin(currAngle)
      point2 = pl.Vec2(x, y)
      RayCastClosest.reset()
      this.body.getWorld().rayCast(point1, point2, RayCastClosest.callback)

      if (RayCastClosest.hit) {
        locations[i] = Math.sqrt(Math.pow(point1.x - RayCastClosest.point.x, 2) + Math.pow(point1.y - RayCastClosest.point.y, 2))
        draw ? testbed.drawSegment(point1, RayCastClosest.point, testbed.color(0.4, 0.9, 0.4)) : ''
      }
      else {
        locations[i] = carConfig.rayLength
        draw ? testbed.drawSegment(point1, point2, testbed.color(0.4, 0.9, 0.4)) : ''
      }

      currAngle -= Math.PI / 4
    }

    return locations
  }

  kill() {
    this.body.setAwake(false)
    this.agent.alive = false
  }

  updateFitness(segmentBody) {
    if (segmentBody.getUserData() == this.goalsHit) {
      this.goalsHit++
      // this.agent.fitness += 1
    }
  }

  p5draw() {
    var position = this.body.getPosition()
    angleMode(RADIANS)
    rectMode(RADIUS)
    fill(0, 255, 0)
    rotate(this.body.getAngle())
    rect(position.x * ppu, position.y * ppu, carConfig.width * ppu, carConfig.length * ppu)
  }

}
