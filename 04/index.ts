const input = await Deno.readTextFile("./04/data.txt");

const cells = input.split("\n").map((line) => line.split(""));

function answer1() {
  // iterate over each cell with index
  let found = 0;
  for (const [y, row] of cells.entries()) {
    for (const [x, ch] of row.entries()) {
      if (ch === "X") {
        // Define all 8 directions as [dy, dx] pairs
        const directions = [
          [0, 1], // right
          [1, 1], // down-right
          [1, 0], // down
          [1, -1], // down-left
          [0, -1], // left
          [-1, -1], // up-left
          [-1, 0], // up
          [-1, 1], // up-right
        ];

        for (const [dy, dx] of directions) {
          if (
            (dy === 0 ? row : cells[y + dy])?.[x + dx] === "M" &&
            (dy === 0 ? row : cells[y + dy * 2])?.[x + dx * 2] === "A" &&
            (dy === 0 ? row : cells[y + dy * 3])?.[x + dx * 3] === "S"
          ) {
            found++;
          }
        }
      }
    }
  }
  return found;
}

console.log(answer1());

function answer2() {
  let found = 0;
  for (const [y, row] of cells.entries()) {
    for (const [x, ch] of row.entries()) {
      if (ch === "A") {
        if (
          ((cells[y + 1]?.[x + 1] === "M" && cells[y - 1]?.[x - 1] === "S") ||
            (cells[y + 1]?.[x + 1] === "S" && cells[y - 1]?.[x - 1] === "M")) &&
          ((cells[y + 1]?.[x - 1] === "S" && cells[y - 1]?.[x + 1] === "M") ||
            (cells[y + 1]?.[x - 1] === "M" && cells[y - 1]?.[x + 1] === "S"))
        ) {
          found++;
        }
      }
    }
  }
  return found;
}

console.log(answer2());
