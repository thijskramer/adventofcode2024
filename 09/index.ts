const input = await Deno.readTextFile("./09/data.txt");

function createBlocks(input: string) {
  const blocks = [];
  for (const [idx, ch] of input.trim().split("").entries()) {
    let block = ".";
    if (idx % 2 === 0) {
      block = (idx / 2).toString();
    }
    blocks.push(Array.from({ length: Number(ch) }, () => block));
  }
  return blocks;
}

function defrag(blocks: string[]) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] === ".") {
      // move the last block that's not a dot to this index:
      const lastBlockIndex = blocks.findLastIndex((block) => block !== ".");
      if (lastBlockIndex !== -1 && lastBlockIndex > i) {
        blocks[i] = blocks[lastBlockIndex];
        blocks[lastBlockIndex] = ".";
      }
    }
    if (blocks.findLastIndex((block) => block !== ".") < i) {
      break;
    }
  }
  return [...blocks];
}

function defragAlt(blocks: string[][]) {
  const copy = blocks.toReversed();
  // move the first file to the last available space:

  for (const [idx, file] of copy.entries()) {
    if (file.length > 0 && file.every((x) => Number.isInteger(Number(x)))) {
      const lastAvailableSpaceIndex = copy.findLastIndex(
        (x) => x.filter((v) => v === ".").length >= file.length
      );

      if (lastAvailableSpaceIndex < 0) {
        continue;
      }
      if (lastAvailableSpaceIndex <= idx) {
        continue;
      }

      copy[lastAvailableSpaceIndex] = [
        ...copy[lastAvailableSpaceIndex].filter((v) => v !== "."),
        ...file,
        ...Array.from(
          {
            length:
              copy[lastAvailableSpaceIndex].filter((v) => v === ".").length -
              file.length,
          },
          () => "."
        ),
      ];

      copy[idx].fill(".");
    }
  }

  return copy.toReversed();
}

function answer1() {
  const t = performance.now();
  const blocks = createBlocks(input);
  const defraggedBlocks = defrag(blocks.flat());
  const checksum = defraggedBlocks.reduce((prev, curr, currIndex) => {
    if (curr !== ".") {
      return prev + Number(curr) * currIndex;
    }
    return prev;
  }, 0);
  console.log("duration:", `${Math.round(performance.now() - t)}ms`);
  return checksum;
}

console.log(answer1());

function answer2() {
  const t = performance.now();
  const blocks = createBlocks(input);
  const defraggedBlocks = defragAlt(blocks);
  const checksum = defraggedBlocks.flat().reduce((prev, curr, currIndex) => {
    if (curr !== ".") {
      return prev + Number(curr) * currIndex;
    }
    return prev;
  }, 0);
  console.log("duration:", `${Math.round(performance.now() - t)}ms`);
  return checksum;
}

console.log(answer2());
