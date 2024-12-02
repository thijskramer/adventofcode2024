const input = await Deno.readTextFile("./01/data.txt");

const leftList: number[] = [];
const rightList: number[] = [];

input.split("\n").forEach((line) => {
  const [left, right] = line.split(/\s+/).map((num) => parseInt(num));
  if (Number.isNaN(left) || Number.isNaN(right)) return;
  leftList.push(left);
  rightList.push(right);
});

console.log(leftList, rightList);

function part1() {
  const sortedLeftList = [...leftList].toSorted();
  const sortedRightList = [...rightList].toSorted();
  const diffs: number[] = [];

  for (let i = 0; i < sortedLeftList.length; i++) {
    diffs.push(Math.abs(sortedRightList[i] - sortedLeftList[i]));
  }
  console.log(diffs.filter((diff) => Number.isNaN(diff)));
  console.log(diffs.reduce((acc, curr) => acc + curr, 0));
}

part1();

function part2() {
  let score = 0;
  for (let i = 0; i < leftList.length; i++) {
    const occurences = rightList.filter((x) => x === leftList[i]).length;
    score += leftList[i] * occurences;
  }
  console.log(score);
}

part2();
