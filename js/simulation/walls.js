var pl = planck

class Walls {
  constructor(world, segments) {
    // segments: list of 2x2 lists representing segment endpoints
    var segmentDef = {
      filterCategoryBits: collisionCategories.wall,
      filterMaskBits: collisionCategories.car | collisionCategories.ray,
      density: 0
    }

    this.body = world.createBody()
    let body = this.body
    let p1
    let p2
    segments.forEach(function (segment) {
      p1 = pl.Vec2(segment[0][0], segment[0][1])
      p2 = pl.Vec2(segment[1][0], segment[1][1])
      body.createFixture(pl.Edge(p1, p2), segmentDef)
    })
  }
}
