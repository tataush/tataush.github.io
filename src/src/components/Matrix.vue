<template>
  <div class="matrix">
<code>
      <pre>
let matrix = [
    [
        [
            [0, 0, 1, 0],
            [1, 0, 1, 1],
            [0, 0, 0, 1],
            [1, 0, 0, 0],
            [0, 1, 0, 0],
        ],
    ],
];
    </pre>
</code>
    <h1>Количество островов: {{result}}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      result: null,
      matrix: [[[
        [0, 0, 1, 0],
        [1, 0, 1, 1],
        [0, 0, 0, 1],
        [1, 0, 0, 0],
        [0, 1, 0, 0]
      ]]]
    }
  },
  methods: {
    search (arr) {
      let rows = arr.length
      let cols = arr[0].length
      let land = 0
      let water = []
      let left = 0
      let up = 0
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!arr[row][col]) {
            continue
          }
          left = col > 0 ? arr[row][col - 1] : 0
          up = row > 0 ? arr[row - 1][col] : 0
          if (!left && !up) {
            land++
            arr[row][col] = land
          } else if (left && !up) {
            arr[row][col] = left
          } else if (!left && up) {
            arr[row][col] = up
          }
        }
      }
      return land - water.length
    }
  },
  created () {
    for (let i = 0; i < this.matrix.length; i++) {
      let arr = this.matrix[i][0]
      let lands = this.search(arr)
      this.result = lands
    }
  }
}
</script>

<style>
.matrix {
  text-align: center;
}
pre {
  max-width: 300px;
  text-align: left;
  margin: 0 auto;
}
</style>
