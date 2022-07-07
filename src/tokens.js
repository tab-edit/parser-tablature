import { ExternalTokenizer } from "@lezer/lr";
import { eof, insertLineName, insertDivider, tabStringBreak as tsBreak } from "./parser.terms";

const newline = 10, carriageReturn = 13, space = 32, tab = 9, hash = 35, parenOpen = 40, dot = 46, pipe = 124, dash = 45;

export const endOfFile = new ExternalTokenizer((input) => {
  if (input.next < 0) {
    input.acceptToken(eof);
  }
})

export const insertions = new ExternalTokenizer((input, stack) => {
  let {next} = input;
  if (next == pipe && stack.canShift(insertLineName)) {
    input.acceptToken(insertLineName);
  }
  if (next == dash && stack.canShift(insertDivider)) {
    input.acceptToken(insertDivider);
  }
}, {contextual: true, fallback: true})

export const tabStringBreak = new ExternalTokenizer((input, stack) => {
  if (!stack.canShift(tsBreak)) return;
  if (input.next < 0 || input.next == newline || input.next == carriageReturn || input.next == pipe) {
    input.acceptToken(tsBreak);
  } else {
    let spaces = input.peek(-1)==space || input.peek(-1)==tab ? 1 : 0;
    while(input.next==space || input.next==tab) { input.advance(); spaces++; }

    if (spaces > 0 && input.next != dash) {
      input.acceptToken(tsBreak);
    }
  }
}, {contextual: true, fallback: true})