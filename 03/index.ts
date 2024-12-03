const input = await Deno.readTextFile("./03/data.txt");

function answer1() {
  const instructions = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
  let acc = 0;
  for (const instruction of instructions) {
    const [_, left, right] = instruction;
    acc += parseInt(left) * parseInt(right);
  }
  return acc;
}

function answer2() {
  const instructions = input.matchAll(
    /(mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|(don\'t\(\))/g
  );
  let acc = 0;
  let enabled = true;
  for (const instruction of instructions) {
    const [instr, _, left, right] = instruction;
    if (instr === "do()") {
      enabled = true;
      continue;
    } else if (instr === "don't()") {
      enabled = false;
      continue;
    }
    if (enabled) {
      acc += parseInt(left) * parseInt(right);
    }
  }
  return acc;
}

console.log(answer1());
console.log(answer2());
