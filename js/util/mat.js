class Matrix {
  // initialize nxm matrix w/ values from -1 to 1
  constructor(rowNum, colNum) {
    this.rows = new Array(rowNum)
    for (let i = 0; i < rowNum; ++i) {
      this.rows[i] = new Array(colNum)
      for (let j = 0; j < colNum; ++j) {
        this.rows[i][j] = Math.random() * 2 - 1
      }
    }
  }

  mul(vec) {
    if (vec.length != this.rows[0].length)
      return null
    return this.rows.map(row => dot(row, vec))
  }

  set(val, i, j) {
    this.rows[i][j] = val
  }
}

function dot(v1, v2) {
  if (v1.length != v2.length)
    return null

  var product = 0
  for (var i = 0; i < v1.length; ++i)
    product += v1[i] * v2[i]
  return product
}
