const input = await Deno.readTextFile("./08/data.txt");

const grid = input
  .split("\n")
  .filter(Boolean)
  .map((row) => row.split(""));

function getCoordsForAntennae(grid: string[][], antenna: string) {
  const coords = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === antenna) coords.push([x, y]);
    }
  }
  return coords;
}

function getPairs(coords: number[][]) {
  const pairs = [];
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      pairs.push([coords[i], coords[j]]);
    }
  }
  return pairs;
}

function getAntiNodesInOneDirection(
  [startX, startY]: number[],
  [maxX, maxY]: number[],
  xDiff: number,
  yDiff: number,
  maxInOneDirection = 1,
  direction: "positive" | "negative" = "positive"
) {
  const antiNodes = [];
  for (let i = 1; i <= maxInOneDirection; i++) {
    const multiplier = direction === "positive" ? 1 : -1;
    const antiNode = [
      startX + xDiff * multiplier * i,
      startY + yDiff * multiplier * i,
    ];
    if (
      antiNode[0] < 0 ||
      antiNode[0] > maxX ||
      antiNode[1] < 0 ||
      antiNode[1] > maxY
    )
      break;
    antiNodes.push(antiNode);
  }
  return antiNodes;
}

function getAllAntiNodes(
  [[a1x, a1y], [a2x, a2y]]: number[][],
  [maxX, maxY]: number[],
  maxInOneDirection = 1
) {
  const xDiff = a1x - a2x;
  const yDiff = a1y - a2y;

  const getAntiNodesInDirection = (
    start: number[],
    direction: "positive" | "negative"
  ) =>
    getAntiNodesInOneDirection(
      start,
      [maxX, maxY],
      xDiff,
      yDiff,
      maxInOneDirection,
      direction
    );
  const antiNodes = getAntiNodesInDirection([a1x, a1y], "positive");
  const antiNodes2 = getAntiNodesInDirection([a2x, a2y], "negative");
  return [...antiNodes, ...antiNodes2];
}

function getAntiNodeCount({
  grid,
  directionalLimit = 1,
  includeAntennas = false,
}: {
  grid: string[][];
  directionalLimit?: number;
  includeAntennas?: boolean;
}) {
  const uniqueAntennae = new Set(grid.flat().filter((x) => x !== "."));
  const gridAntiNodes = new Map<string, number[]>();

  for (const antenna of uniqueAntennae) {
    const coords = getCoordsForAntennae(grid, antenna);
    const antennaPairs = getPairs(coords);

    for (const pair of antennaPairs) {
      const antiNodes = getAllAntiNodes(
        pair,
        [grid[0].length, grid.length],
        directionalLimit
      );
      if (includeAntennas) {
        antiNodes.push(...pair);
      }
      for (const antiNode of antiNodes) {
        if (antiNode[0] > grid[0].length - 1 || antiNode[1] > grid.length - 1) {
          continue;
        }
        if (antiNode[0] < 0 || antiNode[1] < 0) continue;
        gridAntiNodes.set(antiNode.join(","), antiNode);
      }
    }
  }
  return gridAntiNodes.size;
}

console.log("Answer 1:", getAntiNodeCount({ grid }));
console.log(
  "Answer 2:",
  getAntiNodeCount({ grid, directionalLimit: 999, includeAntennas: true })
);
