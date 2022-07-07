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

# notes for general tab-edit project
the tab-state package generates the state linearly from the whole package and only has one final state at the end that is accurate. what if we make it generate a state for each tab fragment? idk

Our two main problems to overcome in this project are:
- how do we extract a meaningful abstract syntax tree when we parse text that is not tablature, but around tablature? like lyrics. I really want a plug-and-play feel to the system, so i feel that commenting out lyrics would be too distracting from the experience.
    - i think making the tab-state state generator be a two-pass generator. the first pass determines if the tab segment is valid or not. if it is not valid, then it is pretty much just lyrics or random text. the second pass then does the xml generation or linting. This prevents invalid nodes which are basically just lyrics from polluting the linting space for example.
        - i feel that if we take this approach, we have to have a way for the user to say: "no, i know you think this is an invalid tab segment, but it is valid". maybe we can have comment directives that tell us to generate the state (linting/xml-gen/e.t.c) of that tab section even though it is invalid. this can be a comment placed directly above the tab segment
        - if we are taking this approach, we also need some visual to let the user know which tab segments are actually being parsed. maybe those will have a different background in the editor, or a line to the side of the tab segment, just like vs code puts a line on the side of the markdown text-block you are currently editing.
- How do we differentiate between the measure-insides of stringed tablature vs percussion tablature, because they have very different syntax structure?
    - I really want to be able to auto-detect what instrument type is being used, and i would really like it to be possible to have multiple instrument types across the same tablature document, so i feel that it is necessary to make this differentiation rather than declaring an instrument type then parsing with that knowledge
    - perhaps we use dialects in the lezer grammar
        - problems:
            - how do we clearly define without conflict the start/end of the stringed dialect vs the start/end of the percussion dialect?
            - setting the dialect for the whole parser negates the point of this, as we would only have one insrtrument type per document
                - **maybe** this can be fixed with how we have sub-languages embedded within the first language. again there is the problem of how do we create an unambiguous start and end for the dialects

Another problem is that the tab-state is generated for the whole document and in some scenarios only produces a valid output when the whole document syntax tree is explored (e.g. for xml-gen, not for linting). more importantly, they also have to completely re-generate after every edit.
- maybe we can make it so that the state is "checkpointed" at the end of every tab fragment. then when a re-parse is triggered, we only start at the recently-updated fragment. 
    - This will not work perfectly for cases where we have a global state though, like xml-gen (cuz we have to regenerate everything from the first changed fragment), but it might work and speed things up a lot for linting.
    - maybe we can differentiate between global states and fragment-scoped states that it is ok for them to be reset at every fragment start. that way we only have to re-generate global states, but fragment-scoped states are cached in their fragments.
        - global states may depend on fragment-scoped states though, and because of the procedural way the state is generated (with no preservation of intermediate states), we may need to re-generate a number of fragment-scoped states in order to compute the global state values.
        - procedure suggestion:
        - we have onFragmentEnd() visitor for all rules. let's define global rules as all rules that self-define as global. every non-global rule's state is stored on the fragment after the onFragmentEnd() visitor for that rule is called (if it has that visitor) or just when the fragment ends (if it doesn't have that visitor).
        - whenever an external state is requested from an onFragmentEnd() visitor, it first checks if that state is cached in the fragment. if not, it then catches up on the calls to update the state, up until the end of the fragment (sidenote explanation: state updates are(should be) performed lazily, only upon request or if the rule's state is exposed) and then caches and uses this newly-computed state to respond to the external state request. This way, we cache data, but if a visitor BEFORE the fragment end requests the state, we know to re-compute the state. this is helpful because a global state like the aggregated linting state will not require the intermediary values of fragment-scoped states - it will only require their final value. However, some other global states like xml-gen will require the intermediary values of fragment-scoped states, so because intermediary values are not stored, even though the final value is cached and we know it is still correct, we still have to recompute the intermediary values of these fragment-scoped states to use them to compute the value of the possibly-changed global states. Using the above-defined system, we do not have to make a distinction between global states and fragment-scoped states aside from a boolean stating which rules are global. we don't have to treat the two kinds of rules differently much. we only make the distinction that we always call the visitors of global states that are exported, however we only call the visitors of fragment-scoped states when they are exported and their value is not cached in the fragment. the other detail - about the intermediary value of fragment-scoped states having to be recomputed when externally requested by a global state - this detail is abstracted away into the requestExternalState() function if implemented well.

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