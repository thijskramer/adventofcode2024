const input = await Deno.readTextFile("./06/data.txt");

const grid = input
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(""));

const getStartingPosition = (grid: string[][]) => {
  for (const [y, row] of grid.entries()) {
    for (const [x, ch] of row.entries()) {
      if (ch === "^") {
        return [x, y];
      }
    }
  }
  throw new Error("Starting position not found");
};

const directions = {
  up: {
    dx: 0,
    dy: -1,
    next: "right",
  },
  right: {
    dx: 1,
    dy: 0,
    next: "down",
  },
  down: {
    dx: 0,
    dy: 1,
    next: "left",
  },
  left: {
    dx: -1,
    dy: 0,
    next: "up",
  },
};

function walk(
  grid: string[][],
  startX: number,
  startY: number,
  direction: "up" | "down" | "left" | "right",
  path: [number, number, string][] = [],
  obstacles: [number, number, string][] = []
): [number, number, string][] {
  const { dx, dy, next } = directions[direction];
  let x = startX;
  let y = startY;

  while (true) {
    if (grid[y + dy]?.[x + dx] === "#" || grid[y + dy]?.[x + dx] === "@") {
      if (
        obstacles.find(
          ([ox, oy, dir]) => ox === x + dx && oy === y + dy && dir === next
        )
      ) {
        // infinite loop detected!
        return [];
      }
      obstacles.push([x + dx, y + dy, next]);
      break;
    }
    x += dx;
    y += dy;

    if (x < 0 || y < 0 || x >= grid[y]?.length || y >= grid.length) {
      return path;
    }
    path.push([x, y, direction]);
  }

  return walk(
    grid,
    x,
    y,
    next as "up" | "down" | "left" | "right",
    path,
    obstacles
  );
}

function answer1(grid: string[][]) {
  const [startX, startY] = getStartingPosition(grid);
  const path = walk(grid, startX, startY, "up", [[startX, startY, "up"]]);
  const uniqueCells = new Set([...path.map(([x, y]) => `${x},${y}`)]);

  return uniqueCells.size;
}

console.log(answer1(grid));

console.log("\n-------------\n");

function answer2(grid: string[][]) {
  const [startX, startY] = getStartingPosition(grid);
  const path = walk(grid, startX, startY, "up", []);
  const loopCausingObstaclePositions = new Set();

  for (const [x, y] of path) {
    const tempGrid = structuredClone(grid);
    tempGrid[y][x] = "@";
    const tempPath = walk(tempGrid, startX, startY, "up", []);
    if (tempPath.length === 0) {
      // loop detected!
      loopCausingObstaclePositions.add([x, y].join(","));
    }
  }

  return loopCausingObstaclePositions.size;
}

console.log(answer2(grid));
