const input = await Deno.readTextFile("./11/data.txt");

const stones = input.split(" ").map(Number);

function calculateStones(
  stone: number,
  steps: number,
  memo: Map<number, Map<number, number>>
) {
  if (steps === 0) return 1;
  const rememberedStep = memo.get(steps);
  const rememberedStone = rememberedStep?.get(stone);
  if (rememberedStone) return rememberedStone;

  let result: number;

  if (stone === 0) {
    result = calculateStones(1, steps - 1, memo);
  } else if (stone.toString().length % 2 === 0) {
    const half = stone.toString().length / 2;
    result =
      calculateStones(
        Number(stone.toString().slice(0, half)),
        steps - 1,
        memo
      ) +
      calculateStones(Number(stone.toString().slice(half)), steps - 1, memo);
  } else {
    result = calculateStones(stone * 2024, steps - 1, memo);
  }

  if (!memo.has(steps)) {
    memo.set(steps, new Map());
  }
  memo.get(steps)!.set(stone, result);
  return result;
}

function answer1(stones: number[]) {
  const memo = new Map<number, Map<number, number>>();
  return stones
    .map((stone) => calculateStones(stone, 25, memo))
    .reduce((a, b) => a + b, 0);
}

console.log(answer1(stones));

function answer2(stones: number[]) {
  const memo = new Map<number, Map<number, number>>();
  return stones
    .map((stone) => calculateStones(stone, 75, memo))
    .reduce((a, b) => a + b, 0);
}

console.log(answer2(stones));
