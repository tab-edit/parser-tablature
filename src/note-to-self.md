guiding principle:
try to abstract as much as possible, avoiding being instrument-specific (e.g. define a line name as just 4 characters, starting with a letter, and containing letters or numbers)


NoteConnectors should not have a nested structure. The connectors should be their own 


measurelines should be defined as (one or two |'s that have no space inbetween) followed by (measure contents i.e. dashes, frets, e.t.c.)
then you should have an open-measureline token/rule which is defined as 

measures should be defined as such, without spacing:
name measurelines (one or two |'s that have no space inbetween)

we want to generify as much as possible(instrument-agnostic), so maybe definition of a component should be:
[a-zA-Z\[{(] followed by a note followed by [\[{(]
we use lookahead to distinguish connector from component. that way, we can gave g both as a connector and as a component.

on second thought, maybe not the best idea, because then we can't have leading connector right before a note if it can be misinterpreted as a component.

e.g. these two would be inconsistent even though they should be the same: ``|--7-g5|`` and ``|--7-g-5|``. `g` is a component in one and a connector in the other. not consistent.

decorator letters (like grace, which can be mistaken for a connector) take precedence over connectors
so that they "glue" to the note that they are decorating.

say g is both a decorator and a connector.
this:
```
g7g2
```
would mean ``grace(7) grace(2)``
and this:
```
g7gg2
```
would mean grace(7) g grace(2)

we have only certain symbols that are allowed as grace symbols, but any 
letter and certain symbols can be a connector, then maybe we specialize the connectors
to become hammers, slides, e.t.c.

to think of, should we allow things like this?:
```
|--[g7]--]
```

# Questions to ask
- how would you like comments to look like? for now it's '`#`'
- what kind of funky syntax have you seen out in the field? ( syntax that deviates from the norm)
    - how common are they?
    - how common are inline repeats? it seems like a hassle to implement, and i've never seen it out in the field before

# Documentation notes:
if you have a measure line name for a tab string, you can omit the initial divider for the first measure line in the tab string.
i.e. this is valid:
```
a--|--|
```
conversely, if you have a divider for the first measure line in the tab string, you can omit the measureline name.
i.e. this is valid:
```
|--|--|
```
to summarize, you can have either the name or divider or both, but not none.


to be counted as separate, two tab strings must either be separated by space, or they must both end and start with a pipe.
e.g.:
separated by space:
```
a|--| a|--|
a|--|  |--|
```
one ends, other starts with a pipe:
```
a|--|||--|      // this basically is these two tab strings: a|--||  and  |--|
```