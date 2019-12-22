var pl = planck

var RayCastClosest = (function() {
  var def = {};

  def.reset = function() {
    def.hit = false;
    def.point = null;
    def.normal = null;
  };

  def.callback = function(fixture, point, normal, fraction) {
    var category = fixture.getFilterCategoryBits()
    if (category == collisionCategories.car || category == collisionCategories.goal)
      return -1.0

    def.hit = true;
    def.point = point;
    def.normal = normal;

    // By returning the current fraction, we instruct the calling code to clip the ray and
    // continue the ray-cast to the next fixture. WARNING: do not assume that fixtures
    // are reported in order. However, by clipping, we can always get the closest fixture.
    return fraction;
  };

  return def;
})()