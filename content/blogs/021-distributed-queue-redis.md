---
date: '2026-10-11'
title: 'Distributed Queue in Golang - Part 2: Redis Backend'
slug: 'distributed-queue-redis-backend'
description: 'Moving the distributed queue to Redis as a shared memory backend - BLPOP for blocking dequeues, timeout handling, and data races on shutdown.'
tags:
  - Distributed Systems
  - Golang
  - Queues
  - Redis
---

![Distributed Queue Redis Backend](/blog/021-distributed-queue-redis-hero.jpg)

so for the past few weekends - i had been scrubbing my brain to implement a distributed queue in golang. although, this is an age-old problem, and state-of-art solutions exist - kafka, rabbit MQ, etc, but I still gave my thought experiment some time started off.

## moving to redis

my initial 2 experiments building it, were around a) starting off an in-process shared queue, and then b) to a shared memory implementation between processes on the same host. but there's more often not the case as both (a) and (b). producers and consumers are usually on different hosts, and/or different networks to increase fault tolerance. so, for this next part I chose Redis as the memory store and wrote producer/consumer off it, using Redis lists since they are optimized for FIFO operations.

## nuances

there were some cool nuances with it too -

1. consumer shouldn't be a poll-all-the-time, as querying from the queue while no item is present could hog network bandwidth. so, I used `BLPOP` for dequeueing, which blocks indefinitely until an element is available.

2. of course, I had setup default timeouts on context, so that infinite block doesn't actually mean infinite. this saves CPU on both client, and Redis; and doesn't hog network as well.

3. interestingly (as with each experiment) each partition could be served on different backends while the queue would operate deterministically. so producer, and consumer both can set options as to what memory backend they want to use. I know this doesn't make much sense, but I felt that there are some use cases for this too.

4. i also came across a data race, when benchmarking this implementation with significant concurrency; and got "close of closed channel" while shutdown. this was careless of me though, didn't think of shared access.
