import { ExternalTokenizer } from "@lezer/lr";
import {
  eof,
  newline as newlineToken,
  newlineEmpty,
  incomingNewline,
  incomingEOF,
  incomingComponentConnector,
  stafflineSep,
  connectorSymb,
  graceSym,
} from "./parser.terms.js";

const newline = 10,
  carriageReturn = 13,
  space = 32,
  tab = 9,
  dash = 45,
  u = 117,
  g = 103,
  s = 115,
  G = 71;

export const newlines = new ExternalTokenizer((input) => {
  if (input.next < 0) {
    input.acceptToken(eof);
  } else if (input.next != newline && input.next != carriageReturn) {
  } else {
    // this if statement handles the CRLF line ending
    if (input.next == carriageReturn) {
      input.advance();
      if (input.next != newline) return;
    }
    input.advance();
    let spaces = 0;
    while (input.next == space || input.next == tab) {
      input.advance();
      spaces++;
    }
    let empty = input.next == newline || input.next == carriageReturn;
    input.acceptToken(empty ? newlineEmpty : newlineToken, empty ? 1 : 0);
  }
});

export const lookaheads = new ExternalTokenizer(
  (input) => {
    if (input.next < 0) {
      input.acceptToken(incomingEOF);
    } else if (input.next == newline || input.next == carriageReturn) {
      input.acceptToken(incomingNewline);
    }
  }
);

export const stafflineSeparator = new ExternalTokenizer(
  (input) => {
    if (
      input.next == space ||
      input.next == tab ||
      input.next == newline ||
      input.next == carriageReturn ||
      input.next < 0
    ) {
      input.acceptToken(stafflineSep);
    } else {
      let prevChar = input.peek(-1);
      if (prevChar == space || prevChar == tab) {
        input.acceptToken(stafflineSep);
      }
    }
  },
  { fallback: true }
);

export const measureComponentExternTokens = new ExternalTokenizer(
  (input, stack) => {
    if (input.next == g || input.next == G) {
      input.advance();
      if (isNum(input.next)) input.acceptToken(graceSym);
    } else {
      while (input.next == dash || input.next == space || input.next == tab) {
        input.advance();
      }
      if (stack.canShift(connectorSymb)) {
        //stack.canShift(connectorSymb)) {
        input.acceptToken(incomingComponentConnector);
      }
    }
  },
  { contextual: true, fallback:true }
);

function isNum(charCode) {
  return charCode >= 48 && charCode <= 57;
}
