// I have found it easy to visualize tracks with tables in desmos.
// So this script can be copied into the js console in desmos to create a string
// of the python list of segments needed to create a track

let points = []
let state = Calc.getState()

for (let i = 0; i < state.expressions.list.length; i++) {
  if (state.expressions.list[i].type == "table") {
      for (let k = 0; k < state.expressions.list[i].columns[0].values.length; k++) {
        points.push([state.expressions.list[i].columns[0].values[k], state.expressions.list[i].columns[1].values[k]])
    }
  }
}

let list = ''
for (let i = 1; i < points.length; i++) {
    list += `[[${points[i-1][0]}, ${points[i-1][1]}], [${points[i][0]}, ${points[i][1]}]], `
}

list = '[' + list.slice(0, list.length - 2) + ']'

// Same thing as above but for generating list of goal segments
let points = []
let state = Calc.getState()

for (let i = 0; i < state.expressions.list.length; i++) {
  if (state.expressions.list[i].type == "table") {
      for (let k = 0; k < state.expressions.list[i].columns[0].values.length; k++) {
        points.push([state.expressions.list[i].columns[0].values[k], state.expressions.list[i].columns[1].values[k]])
    }
  }
}

let segments = ''
for (let i = 0; i < points.length; i+=2) {
    segments += `[[${points[i][0]}, ${points[i][1]}], [${points[i+1][0]}, ${points[i+1][1]}]], `
}

segments = '[' + segments.slice(0, segments.length - 2) + ']'
