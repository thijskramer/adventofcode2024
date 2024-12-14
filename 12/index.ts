const input = await Deno.readTextFile("./12/data.txt");

const grid = input.split("\n").map((row) => row.split(""));

function getNextCoords(currentPosition: number[], grid: string[][]) {
  const [currX, currY] = currentPosition;
  const currCell = grid[currY][currX];
  const nextCoords: number[][] = [];
  for (const [y, row] of grid.entries()) {
    for (const [x, cell] of row.entries()) {
      if (y === currY && x === currX) continue;
      if (Math.abs(y - currY) > 1) continue;
      if (Math.abs(x - currX) > 1) continue;
      if (currCell !== cell) continue;
      if (Math.abs(y - currY) === 1 && Math.abs(x - currX) === 1) continue;
      nextCoords.push([x, y]);
    }
  }
  return nextCoords;
}

function getRegionThisCellBelongsTo(
  coords: number[],
  grid: string[][],
  found: Set<string>
) {
  found.add(coords.join(","));
  const next = getNextCoords(coords, grid);
  for (const n of next.filter((x) => !found.has(x.join(",")))) {
    found.add(n.join(","));
    getRegionThisCellBelongsTo(n, grid, found);
  }
  return found;
}

const getCellBorders = (x: number, y: number, grid: string[][]) => {
  const cell = grid[y][x];
  const top = grid[y - 1]?.[x] === cell ? 0 : "T";
  const bottom = grid[y + 1]?.[x] === cell ? 0 : "B";
  const left = grid[y][x - 1] === cell ? 0 : "L";
  const right = grid[y][x + 1] === cell ? 0 : "R";
  return [top, bottom, left, right].filter((c) => c !== 0);
};

function answer1(grid: string[][]) {
  const cellsAssignedToRegion = new Set<string>();
  const regions = [];
  for (const [y, row] of grid.entries()) {
    for (const [x, _] of row.entries()) {
      if (cellsAssignedToRegion.has(`${x},${y}`)) continue;
      const found = getRegionThisCellBelongsTo([x, y], grid, new Set<string>());
      found.forEach((cell) => cellsAssignedToRegion.add(cell));
      regions.push(found);
    }
  }
  let price = 0;
  for (const region of regions) {
    let borders = 0;
    for (const cell of region) {
      const [x, y] = cell.split(",").map(Number);
      borders += getCellBorders(x, y, grid).length;
    }
    price += borders * region.size;
  }
  return price;
}

console.log("Answer 1: ", answer1(grid));

function answer2(grid: string[][]) {
  const cellsAssignedToRegion = new Set<string>();
  const regions = [];
  for (const [y, row] of grid.entries()) {
    for (const [x, _] of row.entries()) {
      if (cellsAssignedToRegion.has(`${x},${y}`)) continue;
      const found = getRegionThisCellBelongsTo([x, y], grid, new Set<string>());
      found.forEach((cell) => cellsAssignedToRegion.add(cell));
      regions.push(found);
    }
  }

  let price = 0;
  for (const region of regions) {
    const regionBorders: {
      from: number[];
      to: number[];
      side: string;
      sideNumber: number;
    }[] = [];
    for (const cell of region) {
      const [x, y] = cell.split(",").map(Number);
      const borders = getCellBorders(x, y, grid).map((b) => {
        switch (b) {
          case "T":
            return {
              from: [x, y],
              to: [x + 1, y],
              side: "T",
              sideNumber: -1,
            };
          case "B":
            return {
              from: [x, y + 1],
              to: [x + 1, y + 1],
              side: "B",
              sideNumber: -1,
            };
          case "L":
            return {
              from: [x, y],
              to: [x, y + 1],
              side: "L",
              sideNumber: -1,
            };
          case "R":
            return {
              from: [x + 1, y],
              to: [x + 1, y + 1],
              side: "R",
              sideNumber: -1,
            };
          default:
            return {
              from: [-1, -1],
              to: [-1, -1],
              side: "?",
              sideNumber: -1,
            };
        }
      });
      regionBorders.push(...borders);
    }

    let lineIndex = 0;
    const sideOrder = ["T", "R", "B", "L"];
    regionBorders.sort((a, b) => {
      if (a.side.localeCompare(b.side) === 0) {
        return a.to[0] === b.from[0] && a.to[1] === b.from[1] ? -1 : 1;
      }
      return sideOrder.indexOf(a.side) - sideOrder.indexOf(b.side);
    });
    for (const border of regionBorders) {
      if (border.sideNumber === -1) {
        border.sideNumber = lineIndex;
      }
      const next = regionBorders.find(
        (b) =>
          b.from.join(",") === border.to.join(",") && border.side === b.side
      );
      if (next) {
        border.sideNumber = lineIndex;
      } else {
        lineIndex++;
      }
    }

    const distinctSideNumbers = new Set(regionBorders.map((b) => b.sideNumber));
    price += distinctSideNumbers.size * region.size;
  }
  return price;
}

console.log("Answer 2: ", answer2(grid));
