const input = await Deno.readTextFile("./13/data.txt");

const machines = input.split("\n\n").map((machine) => {
  // A machine:
  // Button A: X+26, Y+56
  // Button B: X+43, Y+22
  // Prize: X=6138, Y=6756
  const [buttonA, buttonB, prize] = machine.split("\n");
  const [buttonAX, buttonAY] = buttonA
    .split(": ")[1]
    .split(", ")
    .map((x) => Number(x.split("+")[1]));
  const [buttonBX, buttonBY] = buttonB
    .split(": ")[1]
    .split(", ")
    .map((x) => Number(x.split("+")[1]));
  const [prizeX, prizeY] = prize
    .split(": ")[1]
    .split(", ")
    .map((x) => Number(x.split("=")[1]));
  return {
    buttonA: { x: buttonAX, y: buttonAY },
    buttonB: { x: buttonBX, y: buttonBY },
    prize: { x: prizeX, y: prizeY },
  };
});

type Machine = {
  buttonA: { x: number; y: number };
  buttonB: { x: number; y: number };
  prize: { x: number; y: number };
};

function getButtonPressCounts(machine: Machine) {
  const { buttonA, buttonB, prize } = machine;

  const dividend = prize.x;
  const aQuotient = Math.trunc(dividend / buttonA.x);
  const bQuotient = Math.trunc(dividend / buttonB.x);

  for (let aPressed = aQuotient; aPressed >= 0; aPressed--) {
    for (let bPressed = 0; bPressed <= bQuotient; bPressed++) {
      const xPos = aPressed * buttonA.x + bPressed * buttonB.x;
      const yPos = aPressed * buttonA.y + bPressed * buttonB.y;
      if (xPos === prize.x && yPos === prize.y) {
        return { aPressed, bPressed };
      }
    }
  }
  return null;
}

function answer1(machines: Machine[]) {
  let tokens = 0;
  for (const machine of machines) {
    const result = getButtonPressCounts(machine);
    if (result) {
      const { aPressed, bPressed } = result;
      tokens += aPressed * 3 + bPressed;
    } else {
      console.log("No solution found");
    }
  }
  return tokens;
}

function answer2(machines: Machine[]) {
  let tokens = 0;
  for (const machine of machines
    .map((machine) => ({
      ...machine,
      prize: {
        x: machine.prize.x + 10_000_000_000_000,
        y: machine.prize.y + 10_000_000_000_000,
      },
    }))
    .slice(0, 1)) {
    const result = getButtonPressCounts(machine);
    if (result) {
      const { aPressed, bPressed } = result;
      tokens += aPressed * 3 + bPressed;
    }
  }
  return tokens;
}

console.log("Answer 1:", answer1(machines));
console.log("Answer 2:", answer2(machines));
