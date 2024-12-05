const input = await Deno.readTextFile("./05/data.txt");

const [rulesBlock, updatesBlock] = input.split("\n\n");

const rules = rulesBlock.split("\n").map((line) => line.split("|"));
const updates = updatesBlock
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(","));

function sortByRules(a: string, b: string) {
  const rule = rules.findIndex((r) => r[0] === b && r[1] === a);
  if (rule === -1) {
    return -1;
  }
  return 1;
}

function isInCorrectOrder(arr: string[]) {
  const sorted = arr.toSorted(sortByRules);
  return sorted.every((element, index) => element === arr[index]);
}

function findMiddleItem(arr: string[]) {
  return arr[Math.floor(arr.length / 2)];
}

function answer1() {
  const validUpdates = updates.filter(isInCorrectOrder);

  const middleItems = validUpdates.map(findMiddleItem).map((x) => parseInt(x));
  return middleItems.reduce((acc, curr) => acc + curr, 0);
}

console.log(answer1());

function answer2() {
  const invalidUpdates = updates.filter((update) => !isInCorrectOrder(update));
  const correctedUpdates = invalidUpdates.map((update) =>
    update.toSorted(sortByRules)
  );
  const middleItems = correctedUpdates
    .map(findMiddleItem)
    .map((x) => parseInt(x));
  return middleItems.reduce((acc, curr) => acc + curr, 0);
}

console.log(answer2());
