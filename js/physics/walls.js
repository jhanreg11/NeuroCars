/** walls for track */
class Walls {
  /**
   * Create group of walls.
   * @param {pl.World} world - world to add walls to.
   * @param {Array} segments - list of line segments representing each wall (see trackinfo.js for list structure).
   */
  constructor(world, segments) {
    // segments: list of 2x2 lists representing segment endpoints
    var segmentDef = {
      filterCategoryBits: collisionCategories.wall,
      filterMaskBits: collisionCategories.car | collisionCategories.ray,
      density: 0
    }

    this.body = world.createBody()
    this.body.render = {stroke: '#000000'}
    let body = this.body
    segments.forEach(function (segment) {
      let p1 = pl.Vec2(segment[0][0], segment[0][1])
      let p2 = pl.Vec2(segment[1][0], segment[1][1])
      body.createFixture(pl.Edge(p1, p2), segmentDef)
    })
  }
}
