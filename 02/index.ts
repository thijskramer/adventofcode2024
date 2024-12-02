const input = await Deno.readTextFile("./02/data.txt");

const lines = input
  .split("\n")
  .map((line) => line.split(/\s+/).map((num) => parseInt(num)))
  .filter((x) => x.every((y) => !Number.isNaN(y)));

const isValidLine = (line: number[]) => {
  // must only contain unique numbers
  if (new Set([...line]).size !== line.length) {
    return false;
  }
  // must be ordered either ascending or descending
  if (
    !(
      [...line].toSorted((a, b) => a - b).every((num, i) => num === line[i]) ||
      [...line].toSorted((a, b) => b - a).every((num, i) => num === line[i])
    )
  ) {
    return false;
  }
  // must have deltas between 1 and 3.
  const deltas = [...line]
    .map((num, i) => Math.abs(num - line[i + 1]))
    .filter((delta) => !Number.isNaN(delta));
  if (deltas.some((x) => x > 3 || x < 1)) {
    return false;
  }
  return true;
};

console.log("Part 1: ", lines.filter(isValidLine).length);

console.log(
  "Part 2: ",
  lines.filter((line) => {
    const isValid = isValidLine(line);
    if (!isValid) {
      // try again with one number removed:
      for (let i = 0; i < line.length; i++) {
        const partialLine = [...line].toSpliced(i, 1);
        if (isValidLine(partialLine)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }).length
);
