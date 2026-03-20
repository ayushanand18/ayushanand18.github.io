---
date: '2026-03-08'
title: 'Rewriting a storage engine for graph database in Golang'
slug: 'rewriting-a-storage-engine-for-graph-databases-in-golang'
description: 'Rewriting a storage engine for graph databases, i build sometime back in C++ to Golang.'
tags:
  - Storage Engine
  - Golang
  - LSM Trees
  - Graph Databases
---

## introduction
heya, its sunday evening and as I see my weekend disappear to nothingness, I feel happy because I spent these two 
days again rewriting a storage engine for graph databases, which I built quite a few months back; just like every 
other weekend I spend scratching my brain in front of multiple open tabs on my editor.

## background
back in university, my other friend and I took a different route by not using B-trees, which many graph databases 
do and opted for an LSM-tree approach. although, it is generally advisable to opt for the latter in a write-heavy
workload, since reads could be costlier (one has to check memtables, and subsequently SSTables before agreeing on 
an answer to a read request). but one can always put segregated caches for data/nodes in front, and do some 
probability based fetching to choose which table to fetch from disc. we studied RocksDB (by Meta), which powers 
MyRocks (a storage engine built for MySQL).

## but what and why
our initial benchmarks beat neo4j, though keeping benchmarks for next post. originally written in c++, i found it 
hard to compile across multiple distros lately, so I picked up the task devs enjoy the most! rewriting in golang :). 
what could be a better utilization of a saturday afternoon than playing with goroutines and avoiding to write on 
closed channels xP.

## nuances
fought with 2 neurons left in my brain to face a few interesting problems. listing a few -
1. i knew if throughput needs to maximized, mutex contention time has to be minimized. clever enough right, so 
opted a shared-nothing architecture from start. each worker goroutine will have its memtable, and once it becomes
full flushes to disc.
2. since i wanted to optimize for write throughput, the biggest bottlenecks was make() ← pushing new data meant 
buffer allocation. but lsmtrees had a fixed max (and average) node size, i minimized GC pressure by manually 
maintaining memory using buffer pools. so whenever a block was flushed, it would return to buffer pool, where a 
new worker process could reclaim it. no need for free/make again - eases the lives of GC and mine. this led to 
~60% lesser memory allocations.
3. the very obvious optimal struct alignment - too obvious to be detailed here though.
4. used a shard lock instead of global locks (sync.Mutex) for shared resources like cache. so for reading/invalidating 
from cache, 1 key doesnt have to lock a global resource rather it would hash to a smaller sample space and 
acquire lock on that space. so i could horizontally scale cache space along keys, while latency remains same.

... and a ton of more such learnings. although, being honest i spent last 6 days working on the rewrite. so i 
will save some space for the next 2-3 blog posts. of course if i am fortune enough and get lucky with time, that 
i get enough time to breathe post all this mental activity. i mean i do have a lot of fun doing all this xP.
