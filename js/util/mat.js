/** Class for creating 2d matrices. */
class Matrix {
  /**
   * Create matrix of random numbers.
   * @param {Number} rowNum - number of rows.
   * @param {Number} colNum - number of columns.
   */
  constructor(rowNum, colNum) {
    this.rows = new Array(rowNum)
    for (let i = 0; i < rowNum; ++i) {
      this.rows[i] = new Array(colNum)
      for (let j = 0; j < colNum; ++j) {
        this.rows[i][j] = Math.random() * 2 - 1
      }
    }
  }

  /**
   * multiply matrix by vector.
   * @param {Array} vec - vector.
   * @returns {Array} output vector.
   */
  mul(vec) {
    if (vec.length != this.rows[0].length)
      return null
    return this.rows.map(row => dot(row, vec))
  }

  /**
   * set value of matrix entry.
   * @param {Number} val - value.
   * @param {Number} i - row index.
   * @param {Number} j - column index.
   */
  set(val, i, j) {
    this.rows[i][j] = val
  }

  /**
   * Copies this Matrix's values into a new Matrix.
   * @returns {Matrix} copied Matrix.
   */
  copy() {
    let newMat = new Matrix(this.rows.length, this.rows[0].length)

    for (let i = 0; i < this.rows.length; ++i) {
      for (let j = 0; j < this.rows[i].length; ++j)
        newMat.set(this.rows[i][j], i, j)
    }

    return newMat
  }
}

/**
 * dot product of 2 vectors.
 * @param {Array} v1 - vector 1.
 * @param {Array} v2 - vector 2.
 * @returns {null|number} null for invalid args, dot product otherwise.
 */
function dot(v1, v2) {
  if (v1.length != v2.length)
    return null

  var product = 0
  for (var i = 0; i < v1.length; ++i)
    product += v1[i] * v2[i]
  return product
}
