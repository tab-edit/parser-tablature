import { parser } from "../dist/index.es.js";

let str = `
e|---| a|--|
`
let tree = parser.parse(str)

console.log(prettyPrint(tree.toString()))
let c = tree.cursor()

c.firstChild()
c.firstChild()
c.firstChild()
c.firstChild()
c.nextSibling()
c.nextSibling()

// breakpoint
console.log("done")



function prettyPrint(str) {
    let spaces = 0;
    let spaceConst = "  ";
    let newStr = "";
    for (let char of str) {
        if (char!=")") newStr+=char;
        if (char=="(") {
            spaces++;
            newStr += "\n";
        }
        if (char==")") {
            spaces--;
            newStr+="\n";
            for (let i=0; i<spaces; i++) {
                newStr+=spaceConst;
            }
            newStr+=char;
            newStr+="\n"
        }
        if (char=="(" || char=="\n" || char==")") {
            for (let i=0; i<spaces; i++) {
                newStr+=spaceConst;
            }
        }
    }
    return newStr;
}


function text() {
    return str.substring(c.from, c.to)
}

