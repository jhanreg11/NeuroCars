const ppu = 50
const carConfig = {
  maxForwardSpeed: 250,
  maxBackwardSpeed: -40,
  backTireMaxForce: 300,
  frontTireMaxForce: 500,
  backTireMaxLateralImpulse: 8.5,
  frontTireMaxLateralImpulse: 7.5,
  torque: 15,
  length: 5,
  width: 2.5,
  maxAngle: 0.610865,
  turnSpeedPerSec: 2.79253
}

const backTireConfig = {
  maxForwardSpeed: carConfig.maxForwardSpeed,
  maxBackwardSpeed: carConfig.maxBackwardSpeed,
  maxDriveForce: carConfig.backTireMaxForce,
  maxLateralImpulse: carConfig.backTireMaxLateralImpulse,
  torque: 15,
  length: 1,
  width: .5
}

const frontTireConfig = {
  maxForwardSpeed: carConfig.maxForwardSpeed,
  maxBackwardSpeed: carConfig.maxBackwardSpeed,
  maxDriveForce: carConfig.frontTireMaxForce,
  maxLateralImpulse: carConfig.frontTireMaxLateralImpulse,
  torque: 15,
  length: 5,
  width: 2.5
}

class Car {
  constructor(world, position) {
    this.body = world.createDynamicBody(position)

    // create chassis
    var vertices = []
    vertices.push(planck.Vec2(carConfig.width, carConfig.length))
    vertices.push(planck.Vec2(carConfig.width, -carConfig.length))
    vertices.push(planck.Vec2(-carConfig.width, -carConfig.length))
    vertices.push(planck.Vec2(-carConfig.width, carConfig.length))
    this.body.createFixture(planck.Polygon(vertices), .1)

    // joint def
    var jointDef = {
      enableLimit: true,
      lowerAngle: 0,
      upperAngle: 0,
      localAnchorA: planck.Vec2(-carConfig.width, carConfig.length),
      localAnchorB: planck.Vec2(0, 0)
    }

    // front left tire
    this.tires = []
    var tire = new Tire(world, frontTireConfig)
    this.fljoint = world.createJoint(pl.RevoluteJoint(jointDef, this.body, tire.body))
    this.tires.push(tire)

    // front right tire
    tire = new Tire(world, frontTireConfig)
    jointDef.localAnchorA = planck.Vec2(carConfig.width, carConfig.length)
    this.frjoint = world.createJoint(jointDef, this.body, tire.body)
    this.tires.push(tire)

    // back left tire
    tire = new Tire(world, backTireConfig)
    jointDef.localAnchorA = planck.Vec2(-carConfig.width, -carConfig.length)
    this.bljoint = world.createJoint(jointDef, this.body, tire.body)
    this.tires.push(tire)

    // back right tire
    tire = new Tire(world, backTireConfig)
    jointDef.localAnchorA = planck.Vec2(carConfig.width, -carConfig.length)
    this.brjoint = world.createJoint(jointDef, this.body, tire.body)
    this.tires.push(tire)
  }

  update(accel, turn) {
    for (let tire of this.tires)
      tire.updateFriction()
    for (let tire of this.tires)
      tire.updateDrive(accel)

    var desiredAngle = 0
    if (turn == 1)
      desiredAngle = carConfig.maxAngle
    else if (turn == -1)
      desiredAngle = -carConfig.maxAngle

    var turnPerTimeStep = carConfig.turnSpeedPerSec / 60
    var currAngle = this.fljoint.getJointAngle()
    var angleToTurn = desiredAngle - currAngle
    angleToTurn = planck.Math.clamp(angleToTurn, -turnPerTimeStep, turnPerTimeStep)
    var newAngle = currAngle + angleToTurn
    this.fljoint.setLimits(newAngle, newAngle)
    this.frjoint.setLimits(newAngle, newAngle)
  }
}

class Tire {
  constructor(world, config) {
    this.body = world.createDynamicBody()
    // console.log('Inside constructor', this.body.m_xf)
    this.body.createFixture(planck.Box(config.width, config.length), 1)
    this.config = config
  }

  setConfig(config) {
    this.config = config
  }

  getLateralVelocity() {
    var rightNorm = this.body.getWorldVector(planck.Vec2(1, 0))
    // console.log(this.body.getTransform())
    return rightNorm.mul(planck.Vec2.dot(rightNorm, this.body.getLinearVelocity()))
  }

  getForwardVelocity() {
    var forwardNorm = this.body.getWorldVector(planck.Vec2(0, 1))
    return forwardNorm.mul(planck.Vec2.dot(forwardNorm, this.body.getLinearVelocity()))
  }

  updateFriction() {
    // kill lateral velocity
    var impulse = this.getLateralVelocity().mul(-this.body.getMass())
    if (impulse.length() > this.config.maxLateralImpulse)
      impulse.mul(this.config.maxLateralImpulse / impulse.length())
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
      case 1: desiredSpeed = this.config.maxForwardSpeed; break;
      case -1: desiredSpeed = this.config.maxBackwardSpeed; break;
      default: return
    }

    // find current forward speed
    var forwardNorm = this.body.getWorldVector(planck.Vec2(0, 1))
    var currSpeed = planck.Vec2.dot(this.getForwardVelocity(), forwardNorm)

    // apply necessary force
    var force = 0
    if (desiredSpeed > currSpeed)
      force = this.config.maxDriveForce
    else if (desiredSpeed < currSpeed)
      force = -this.config.maxDriveForce
    else
      return

    this.body.applyForce(forwardNorm.mul(force), this.body.getWorldCenter())
  }

  updateTurn(angle) {
    // console.log('turning')
    // find desired torque
    var desiredTorque = 0
    switch (angle) {
      case 1: desiredTorque = this.config.torque; break;
      case -1: desiredTorque = -this.config.torque; break;
      default: return
    }

    // turn tire
    // this.body.setAngle(this.body.getAngle() + desiredTorque)
    this.body.applyAngularImpulse(desiredTorque, true)
  }

  draw() {
    var position = this.body.getPosition()
    angleMode(RADIANS)
    rectMode(RADIUS)
    fill(0, 255, 0)
    rotate(this.body.getAngle())
    rect(position.x * ppu, position.y * ppu, this.config.width * ppu, this.config.length * ppu)
  }

}
