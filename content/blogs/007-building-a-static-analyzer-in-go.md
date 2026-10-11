---
date: '2026-10-11'
title: 'Building a Static Analyzer in Go'
slug: 'building-a-static-analyzer-in-go'
description: 'Went down the gopls rabbit hole, learned how static analyzers work in Go, and built one to catch SQL injection vulnerabilities.'
tags:
  - Golang
  - Static Analysis
  - Security
  - AST
  - gopls
---

yoo, so last week i was surfing through gopls - trying to reduce its heap usage so that my laptop becomes somewhat usable. in fact in the process of defining what processes to turn off (including some static analyzers), i went a bit further into what analyzers are in go standard libraries, and how do analyzers work.

## the unusedresult analyzer

so i chose one - `unusedresult` analyzer for my learning. this is the static analyzer that gives you build time warnings when the result of a defined method isn't used. interestingly, this warning doesn't appear when we ignore return values of a random function, in fact only a few standard methods (like `Sprintf`) are hard-coded into this analyzer implementation [1].

what it does is simply, traverse the AST preorder (abstract syntax tree) which gopls creates using `go/parser` and `go/token`, determines if node is a method, matches the callee to defined methods that need to be checked, get the callee info if return variable lies on the tree. if it doesn't, it simply means the return value isn't used anywhere, and go ahead with printing a warning.

## why build one myself

static analyzers are great, and that got me into thinking why not build one myself? interestingly, a couple of weeks back we came across a piece of code that was potentially vulnerable to SQL injection attacks since the SQL query construction involved `fmt.Sprintf` directly and not parameterized construction (`?`) which gorm then sanitizes. that led me to thinking that this could easily go unwatched by a human reviewer, and an AI reviewer could easily be blown away if abstraction or change lines become bigger than it could handle. so this was a perfect use case for building a static analyzer that checks this.

in fact this could be extended pretty neatly to other use cases, especially handling potential security vulnerabilities.

## how it works

the approach is straightforward once you understand how `go/analysis` works -

1. register an analyzer using `analysis.Analyzer` with an inspect-type requirement
2. the analyzer receives the AST via `inspect.Preorder` - which visits every node top-down
3. for each `*ast.CallExpr` node, resolve the callee function
4. check if the callee is `fmt.Sprintf` (or other formatting functions)
5. walk up the AST to see if this call is an argument to a database method (like `db.Raw()`, `db.Exec()`, `db.Where()`)
6. if it is - flag it as a potential SQL injection vulnerability, suggest using parameterized queries instead

the key insight from studying `unusedresult` was that you don't need to do complex data flow analysis for many practical checks - just pattern matching on the AST is enough.

## what's next

this pattern of walking the AST and matching against known-dangerous patterns is surprisingly powerful. thinking of extending this to catch -

- hardcoded secrets or API keys in source
- unsafe type assertions without comma-ok
- unbounded goroutine spawning in loops

the `go/analysis` framework makes it really easy to plug these into existing tooling - gopls, golangci-lint, or even CI pipelines. honestly, the hardest part wasn't writing the analyzer, it was understanding how gopls stitches everything together.

---

[1] https://cs.opensource.google/go/x/tools/+/master:go/analysis/passes/unusedresult/unusedresult.go
