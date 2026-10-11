---
date: '2026-10-11'
title: 'Storage Engine for Graph Databases - Part 2: mmap and O_DIRECT'
slug: 'storage-engine-graph-db-part2-mmap'
description: 'Continuing the storage engine rewrite - using mmap for reads, O_DIRECT for WAL writes, and LSM tree compaction without stopping the world.'
tags:
  - Storage Engine
  - Golang
  - LSM Trees
  - Graph Databases
  - Systems
---

![Storage Engine Part 2](/blog/020-storage-engine-part2-hero.jpg)

so i have been trying this for the past few weekends - creating a storage engine for a graph database in golang. although i had written it quite a few years back (in C++), but rewrote it in golang last week. i had written a post last sunday around the initial intricacies and learnings i had building it, and that unexpectedly kinda blew up, so here i am continuing on the nuances.

## what is a storage engine

okay but, many people who came across the last post asked me what a storage engine is. well, a DBMS has multiple parts, including a query language, query processor, and a storage engine to name a few. the storage engine manages the basic CRUD of writing data into memory and disc. the absolute heart is storage engine which should be fast enough/well-designed for the exact use-case the particular DBMS provides. eg, MySQL has InnoDB default, DynamoDB has Berkeley DB (popularly believed), and the likes.

## lsm trees and compaction

lately i have been running on only 2 brain cells, but this time meet my 3rd brain cell which got the nice idea of using LSM trees as the base data structure instead of B-Trees, which the above two use. the biggest con of using the former is unpredictable read latencies and the compaction process that could stop the world. the compaction process is run to merge existing SSTables into one using merge log (a process similar to merge sort). we solved the 2nd by making sure compaction reads sequentially, and writes to a copy so that reads don't get blocked. this is unlike a GC process, which needs to scan entire memory space and block any alloc/deallocations during this time. though, i still don't have a solution for the 1st.

## learnings

1. reading data from SSTables during read-heavy times could be slow if one simply does `read()` system calls sequentially. since it has to switch to kernel mode [adding an interesting stackoverflow thread on the procedure [1]]. the normal routine looks like: `program -> read() syscall -> kernel -> disk/page cache -> copy to user buffer`. instead we used memory maps (mmaps). it maps a file directly onto the process virtual address space. so that you can use it like it's in-memory which you normally do. simply put, `data := s.data[offset : offset+length]`.

2. the `unix.Open()` we just casually use to open files for read/write is more nuanced and the least understood (at least by me). there are multiple flags which OpenFile takes in, one of them being `O_DIRECT`. `O_DIRECT` writes the content to disk, but doesn't add it to the OS page cache. so if you have a file, which you only write data to and don't read from it, you could use `O_DIRECT` flag. WALs are like this; we need WAL only for recovery. [interesting explanation on stackoverflow [2]]

will add benchmark results in the next post. maybe by then my 4th brain cell would come back and join the other 3 folks.

apologising in advance for the unbearable humour i infuse in every post of mine. but adding a piece of art i wrote recently to boost your dopamine. isn't that reward-worthy?
