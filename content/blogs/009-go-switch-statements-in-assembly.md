---
date: '2026-10-11'
title: 'How Go Compiles Switch Statements to Assembly'
slug: 'go-switch-statements-in-assembly'
description: 'Looking at how the Go compiler translates switch statements into assembly - from naive if-else chains to binary search trees, jump tables, and lookup tables.'
tags:
  - Golang
  - Compilers
  - Assembly
  - SSA
  - Systems
---

![Go Switch Statements in Assembly](/blog/009-go-switch-assembly-hero.jpg)

yo, so this week i was reading about how SSA replaced the old go compiler (gc) backend in 1.7. it was an interesting release since this led to major speedup in arm assembly generation, while amd assembly gen became around 10% slower. although this was mainly due to the speedup being traded off against the increased work gc had to do. of course there are no free lunches in this world.

it feels even more tempting to just look at how your go code translates to assembly instructions line-by-line. and it is definitely worth looking up how a switch statement actually ends up looking once the compiler is done with it. because that is where i ended up seeing a hashmap and binary search optimization in assembly.

## the naive expectation

we write something like:

```go
switch whyDoIEvenCareReadingThisVariableNameBecauseItsTooVerbose {
case 1:
 ayush()
case 2:
 is()
case 3:
 good()
default:
 atWritingLinkedInPosts()
}
```

naively, it is tempting to think this just translates to a bunch of cmp + jmp instructions in the same order we wrote the cases. but the compiler, quite intelligent enough, actually chooses between different ways of implementing the dispatch.

## if-else chains

for a small number of cases, it can basically become a chain of if-else comparisons.

```asm
cmp $1, AX
je  case1
...
jmp default
```

## binary search trees

but once the number of cases grows, go's compiler can turn the comparisons into a binary search tree. so instead of chaining through the line, it can first check something around the middle and decide whether we need to search the lower or upper half. which gets us roughly O(log n) comparisons instead of O(n).

## jump tables

and then there is the fun one: jump tables.

the current compiler considers a jump table when there are at least 8 integer cases and the range is dense enough. specifically, it doesn't want a switch like:

```go
case 1
case 1000
case 2000
```

because indexing a table with that range would waste a ridiculous amount of space.

but something like:

```go
case 10
case 11
case 12
case 13
case 14
case 15
case 16
case 17
```

is a good candidate. conceptually that can become something like:

```asm
sub $10, AX
cmp $7, AX
ja  default
jmp *jump_table(AX*8)
```

the value itself effectively becomes the index into a table of target addresses.

## lookup tables and strings

pretty interesting, huh? but then if the switch cases simply return constants, go can completely skip the branching and turn it into a lookup table.

well, switch is not just a simple switch, and strings are another rabbit hole. go first groups string cases by length, and for a group with enough strings it recursively looks at individual bytes to divide the possible strings roughly in half before doing the final equality checks.

so two identical-looking switch statements in go can end up with very different assembly depending on the number, type and distribution of the cases. quite nice use of some most obvious data structures.
