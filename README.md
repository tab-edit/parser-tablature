# parser-tablature

This is an [ascii music tablature](https://en.wikipedia.org/wiki/ASCII_tab) grammar for the [lezer](https://lezer.codemirror.net/) parser system.

Given the informal and non-standardized nature of ascii music tablature syntax online, this parser is made to be very versatile and accepting of as general a syntax as possible, while still being meaningful. Thus it is also as instrument-agnostic as possible. The semantic (and less frequently syntactic) errors naturally accepted by this generalistic approach to a syntax would be addressed by linting rules implemented in the [tab-edit/tab-state](https://github.com/tab-edit/tab-state) package. That package would also handle the instrument-specific semantics of this generalized syntax.
