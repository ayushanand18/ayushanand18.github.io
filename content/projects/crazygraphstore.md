---
date: '2024-03-15'
title: 'CrazyGraphStore - LSM-Tree Storage Engine for Graphs'
github: 'https://github.com/ayushanand18/crazygraphstore'
external: 'https://github.com/ayushanand18/crazygraphstore'
tech:
  - Golang
  - LSM-Tree
  - SSTables
  - Linux
company: ''
showInProjects: true
---

Storage engine for graph databases written from scratch in Go. 3-phase write pipeline (memory → disk → compaction) with crash recovery and bloom-filter lookups on SSTables. Benchmarked at 500K+ reads/sec and 50K+ writes/sec, ~23% higher write throughput than Neo4j in local benchmarks.
