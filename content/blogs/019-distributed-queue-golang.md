---
date: '2026-10-11'
title: 'Building a Distributed Queue in Golang'
slug: 'distributed-queue-golang'
description: 'Implementing a distributed queue with scheduling, rate limiting, and backpressure - and the nuances of NUMA-aware thread scheduling.'
tags:
  - Distributed Systems
  - Golang
  - Queues
  - Performance
  - NUMA
---

![Distributed Queue Code](/blog/019-distributed-queue-golang-hero.jpg)

so it was quite a few weekends back when i tried implementing a distributed queue in golang. although the implementation i came up with was naive, storing messages against partition key x secondary key in a shared-memory queue (could be IPC shared mem, or redis). the first thought experiment solved much of my purpose, but then later, as I started hitting scale (even though tiny), I started to see initial choking points.

## the problems

the initial implementation did not have scheduling and consumption rate limiting, with no backpressure - this led to dequeuers often getting OOMed as the rate of consumption did not hold up to degrowth in free memory. but implementing one actually has a lot of challenges associated -

1. scheduling, if polling-based, has a lot of cpu overhead. it blocks cpu on a regular basis without actually doing anything, especially for sparse tasks - awaking threads. frequently awaking threads from sleep actually has a lot of kernel overhead, not just the cost of context switch (which many of us already know) but putting a thread to sleep increases how often an OS scheduler puts it to a different CPU core. per NUMA (non-uniform memory access), every modern-day CPU has a private core and physical thread-level memory (L2 and L1 caches, respectively). if a different CPU core is assigned, it straightaway invalidates both L1 and L2 cache entries, which otherwise had a non-zero probability of being conserved if the scheduler just kicks out a thread. [1 - adding an interesting stackoverflow thread on this]

2. backpressure is difficult to implement in the sense, what could the producer do if it is signalled that one consumer is in degraded state? i could not find a sensible solution to this. so i believed we should rather have observability rather than choking off producers, queues are designed to have different rates of polls/pushes.

## the scheduler

so, i started off by writing a custom rate limiter for dequeuing, not essentially a rate limiter but in fact a scheduler. in the process, I hit a bit of nuances -

1. carefully ensure my 4th brain cell avoids a poll-sleep-repoll technique, which I openly yelled against just a few seconds ago. had to go through a lot of thought on implementing an interrupt driven scheduler, a gentle reminder, I use golang for all my experiments so, I see a high merit on the default scheduler.

2. i believe maintaining an exact rpm (reqs. per minute) scheduling and thus having higher latency in dequeueing doesn't help me much, so I did a best-effort scheduling but reduced latency. my use case demands as low latency as possible at the cost of consistency. this was also a reason, i picked redis for the queue backend implementation and absolutely minimally backed by disk persistence.

will attaching the piece of art's flow diagram with this post, but meanwhile enjoy the raw beauty of my code - does that look good?
