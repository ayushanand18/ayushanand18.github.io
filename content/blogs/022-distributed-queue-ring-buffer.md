---
date: '2026-10-11'
title: 'Distributed Queue in Golang - Part 1: Ring Buffer'
slug: 'distributed-queue-ring-buffer'
description: 'Starting off building a distributed queue in Golang - a naive ring buffer with multiple memory backends, partitioning, and async/sync support.'
tags:
  - Distributed Systems
  - Golang
  - Queues
  - Ring Buffer
---

![Distributed Queue Ring Buffer](/blog/022-distributed-queue-ring-buffer-hero.jpg)

so I have been trying this for past few weekends - implementing a distributed queue in golang. although, this is an age-old problem, and state-of-art solutions exist - kafka, rabbit MQ, etc, but I still gave my thought experiment some time started off.

## the initial experiment

my initial experiment was to write a queue shared within a process - and extensible to other memory backends. the implementation was a naive ring-buffer which multiple goroutines can enqueue/dequeue from without bumping into each other's offset.

## objectives

had some pretty cool nuances, and set a few objectives -

1. queue should support multiple memory backends, could be process memory, shared memory, redis or any persistent disc.

2. the queue would be partitioned, and unlike other queues, multiple consumers could read from the same partition. this way, we could be writing to any partition and scaling them as-and-when needed.

3. interestingly each partition could be served on different backends while the queue would operate deterministically. so producer, and consumer both can set options as to what memory backend they want to use. I know this doesn't make much sense, but I felt that there are some use cases for this too.

4. processing should be blazing fast, with little memcopy/system call overheads, without being too rigid. wrote interesting performance tests for this.

5. queueing could be async/sync both - depending on per message level.

so, I wrote off a simple implementation with async and sync support, got some interesting learnings and once went into a deadlock, waiting for a semaphore signal when all locked goroutines went to sleep. will share more in the next post.
