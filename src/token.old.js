import { ExternalTokenizer } from "@lezer/lr";
import { eof, graceSym, number } from "./parser.terms.js";

const g = 103,
  G = 71;

export const endOfFile = new ExternalTokenizer((input) => {
  if (input.next < 0) input.acceptToken(eof);
});

export const measureComponentExternTokens = new ExternalTokenizer((input, stack) => {
  if (input.next == g || input.next == G) {
    input.advance();
    if (isDigit(input.next) && stack.canShift(graceSym)) input.acceptToken(graceSym);
  }
}, {fallback: true});

export const numberToken = new ExternalTokenizer((input, stack) => {
  let hasDigit = isDigit(input.next);
  while (isDigit(input.next)) input.advance();
  if (hasDigit && stack.canShift(number)) input.acceptToken(number);
}, {fallback: true})

function isDigit(charCode) {
  return charCode >= 48 && charCode <= 57;
}
