/**
 * Creates a string of a random hex number.
 * @returns {string} hex color (including #).
 */
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

/** Car class for physics simulations. */
class Car {
	/**
	 * Create car.
	 * @param {pl.World} world - planck world to create cars in.
	 * @param {pl.Vec2} position - starting position.
	 * @param {Number} angle - starting angle in radians.
	 */
	constructor(world, position, angle) {
		if (typeof angle == 'undefined')
			angle = 0

		var carShapeDef = {
			filterCategoryBits: collisionCategories.car,
			filterMaskBits: collisionCategories.wall,
			density: 1
		}

		this.agent = null
		this.body = world.createDynamicBody({userData: this, position: position, angle: angle})
		this.body.createFixture(pl.Box(carConfig.width, carConfig.length), carShapeDef)
		this.body.render = {fill: getRandomColor(), stroke: '#000000', width: '10px'}
	}

	/**
	 * Get distance to nearest wall in 5 directions from front of car.
	 * @returns {Array} List of distances.
	 */
	getLocation() {
		let locations = new Array(5)
		let point1 = pl.Vec2(this.body.getPosition())
		point1.add(this.body.getWorldVector(pl.Vec2(0, 1)).mul(carConfig.length))

		let currAngle = this.body.getAngle()
		for (let i = 0; i < locations.length; ++i) {
			let x = point1.x - carConfig.rayLength * Math.cos(currAngle)
			let y = point1.y - carConfig.rayLength * Math.sin(currAngle)
			let point2 = pl.Vec2(x, y)
			RayCastClosest.reset()
			this.body.getWorld().rayCast(point1, point2, RayCastClosest.callback)

			if (RayCastClosest.hit)
				locations[i] = Math.sqrt(Math.pow(point1.x - RayCastClosest.point.x, 2) + Math.pow(point1.y - RayCastClosest.point.y, 2))
			else
				locations[i] = carConfig.rayLength

			currAngle -= Math.PI / 4
		}

		return locations
	}

	/**
	 * Update drive, turn, and friction.
	 * @param {Number} accel - how much to accel [-1, 1]
	 * @param {Number} turn - how much to turn [-1, 1]
	 */
	update(accel, turn) {
		this.updateDrive(accel)
		this.updateTurn(turn)
		this.updateFriction()
	}

	/**
	 * Apply forces to body to simulate real world car physics.
	 */
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

	/**
	 * Apply forces necessary to accel (or not).
	 * @param {Number} accel - 1 to accel forward, -1 to accel backward, 0 to not accel.
	 */
	updateDrive(accel) {
		// find desired speed
		var desiredSpeed = 0
		switch (accel) {
			case 1:
				desiredSpeed = carConfig.maxForwardSpeed;
				break;
			case -1:
				desiredSpeed = carConfig.maxBackwardSpeed;
				break;
			default:
				return
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

	/**
	 * Apply necessary forces to turn.
	 * @param {Number} angle - -1 to turn left, 1 to turn right, 0 to not turn.
	 */
	updateTurn(angle) {
		// find desired torque
		if (this.body.getLinearVelocity().length() == 0)
			return
		var desiredTorque = 0
		switch (angle) {
			case 1:
				desiredTorque = carConfig.torque;
				break;
			case -1:
				desiredTorque = -carConfig.torque;
				break;
			default:
				return
		}

		// turn tire
		this.body.applyAngularImpulse(desiredTorque)
	}

	/**
	 * Get velocity in lateral direction.
	 * @returns {pl.Vec2} velocity in lateral direction.
	 */
	getLateralVelocity() {
		var rightNorm = this.body.getWorldVector(pl.Vec2(1, 0))
		return rightNorm.mul(pl.Vec2.dot(rightNorm, this.body.getLinearVelocity()))
	}

	/**
	 * Get velocity in forward direction.
	 * @returns {pl.Vec2} velocity in forward direction.
	 */
	getForwardVelocity() {
		var forwardNorm = this.body.getWorldVector(pl.Vec2(0, 1))
		return forwardNorm.mul(pl.Vec2.dot(forwardNorm, this.body.getLinearVelocity()))
	}

	/**
	 * Kill car in terms of genetic algorithm.
	 */
	kill() {
		this.body.setAwake(false)
		this.agent.alive = false
	}
}
