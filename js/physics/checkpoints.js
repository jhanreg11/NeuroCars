/** Class for creating goals/checkpoints in track. */
class Checkpoints {
  /**
   * Create group of checkpoints
   * @param {pl.World} world - world to add bodies to.
   * @param {Array} segments - list of line segments representing each goal (see trackinfo.js for list structure).
   */
  constructor(world, segments) {
    var segmentDef = {
      filterCategoryBits: collisionCategories.goal,
      filterMaskBits: collisionCategories.car,
      density: 0,
      isSensor: true
    }

    this.bodies = new Array(segments.length)
    let p1
    let p2
    for (var i = 0; i < segments.length; ++i) {
      p1 = pl.Vec2(segments[i][0][0], segments[i][0][1])
      p2 = pl.Vec2(segments[i][1][0], segments[i][1][1])
      segmentDef.shape = pl.Edge(p1, p2)
      this.bodies[i] = world.createBody({userData: i})
      this.bodies[i].createFixture(segmentDef)
      this.bodies[i].render = {stroke: '#00cc00'}
    }
  }
}