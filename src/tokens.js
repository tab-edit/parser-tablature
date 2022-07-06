import { ExternalTokenizer } from "@lezer/lr";
import { eof, insertLineName, insertDivider } from "./parser.terms";

const newline = 10, carriageReturn = 13, space = 32, tab = 9, hash = 35, parenOpen = 40, dot = 46, pipe = 124, dash = 45;

export const endOfFile = new ExternalTokenizer((input, stack) => {
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