const input = await Deno.readTextFile("./07/data.txt");
const equations: [number, number[]][] = input
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(": "))
  .map(([left, right]) => [
    parseInt(left.trim()),
    right.trim().split(" ").map(Number),
  ]);

function* getAllPermutations(
  items: string[],
  length: number
): Generator<string[]> {
  if (length === 0) {
    yield [];
    return;
  }

  for (const item of items) {
    for (const seq of getAllPermutations(items, length - 1)) {
      yield [item, ...seq];
    }
  }
}

function isValidEquation(
  [answer, input]: [number, number[]],
  operators: string[]
) {
  const sequenceLength = input.length - 1;
  for (const seq of getAllPermutations(operators, sequenceLength)) {
    const result = input.reduce((acc, num, idx) => {
      // idx is 1 on the first iteration without a starting value.
      if (seq[idx - 1] === "+") {
        return acc + num;
      }
      if (seq[idx - 1] === "*") {
        return acc * num;
      }
      if (seq[idx - 1] === "||") {
        return parseInt(acc.toString() + num.toString());
      }
      return acc;
    });
    if (result === answer) return true;
  }
  return false;
}

function getValidEquationSum(
  equations: [number, number[]][],
  operators: string[]
) {
  return equations
    .filter((e) => isValidEquation(e, operators))
    .reduce((acc, [answer]) => acc + answer, 0);
}

function answer1(equations: [number, number[]][]) {
  return getValidEquationSum(equations, ["+", "*"]);
}

function answer2(equations: [number, number[]][]) {
  return getValidEquationSum(equations, ["+", "*", "||"]);
}

console.log("Answer 1:", answer1(equations));
console.log("Answer 2:", answer2(equations));
