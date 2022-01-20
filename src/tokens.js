import { ExternalTokenizer } from "@lezer/lr";
import { eof, graceSym, number } from "./parser.terms.js";

const g = 103,
  G = 71;

export const endOfFile = new ExternalTokenizer((input) => {
  if (input.next < 0) input.acceptToken(eof);
});

export const measureComponentExternTokens = new ExternalTokenizer((input) => {
  if (input.next == g || input.next == G) {
    input.advance();
    if (isNum(input.next)) input.acceptToken(graceSym);
  }
}, {fallback: true});

export const numberToken = new ExternalTokenizer((input) => {
  //only allows for two digit numbers
  if (isNum(input.next)) {
    input.advance();
    if (isNum(input.next)) input.advance();
    input.acceptToken(number);
  }
}, {fallback: true})

function isNum(charCode) {
  return charCode >= 48 && charCode <= 57;
}
