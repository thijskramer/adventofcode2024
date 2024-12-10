const input = await Deno.readTextFile("./10/data.txt");

const grid = input
  .split("\n")
  .filter(Boolean)
  .map((l) => l.split("").map(Number));

function getNextCoords(currentPosition: number[], grid: number[][]) {
  const [currX, currY] = currentPosition;
  const currCell = grid[currY][currX];
  const nextCoords: number[][] = [];
  for (const [y, row] of grid.entries()) {
    for (const [x, cell] of row.entries()) {
      if (y === currY && x === currX) continue;
      if (Math.abs(y - currY) > 1) continue;
      if (Math.abs(x - currX) > 1) continue;
      if (cell - currCell !== 1) continue;
      if (Math.abs(y - currY) === 1 && Math.abs(x - currX) === 1) continue;
      nextCoords.push([x, y]);
    }
  }
  return nextCoords;
}

function* walk(
  currentPosition: number[],
  grid: number[][]
): Generator<number[]> {
  if (grid[currentPosition[1]][currentPosition[0]] === 9) {
    // console.log("foundANineAt", currentPosition);
    yield currentPosition;
  }
  const next = getNextCoords(currentPosition, grid);

  // so for each next coordinate, we have to walk it, until we reach a 9.
  // Each step could branch in another multiple directions, so we have to walk each one.
  for (const n of next) {
    yield* walk(n, grid);
  }
}

function answer1(grid: number[][]) {
  let score = 0;
  for (const [y, row] of grid.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell === 0) {
        const nines = new Set(
          Array.from(walk([x, y], grid)).map((n) => n.join(","))
        );
        score += nines.size;
      }
    }
  }
  return score;
}

function answer2(grid: number[][]) {
  let score = 0;
  for (const [y, row] of grid.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell === 0) {
        score += Array.from(walk([x, y], grid)).length;
      }
    }
  }
  return score;
}

console.log("Answer 1:", answer1(grid));
console.log("Answer 2:", answer2(grid));
