---
date: '2026-10-11'
title: 'Building a Distributed Scheduler with Raft Consensus'
slug: 'distributed-scheduler-raft-consensus'
description: 'Building a disc-backed distributed scheduler with leader-follower replication and raft consensus for failover.'
tags:
  - Distributed Systems
  - Golang
  - Raft
  - Scheduling
  - Systems
---

![Distributed Scheduler Consensus Code](/blog/014-distributed-scheduler-hero.jpg)

heya, so last week i wrote about creating a distributed scheduler. the scheduler would let users execute a specific function at a specified time in UTC - that could be minutes away or weeks apart.

## disc-backed storage

my first choice was implementing one with storage based on disc. each schedule would be stored as a file, in a partition determined by the scheduled duration from now and the number of pending schedules. the file name would contain the schedule timestamp in unix. thus getting the latest schedule to execute is simply `readdir()` and get 1st entry. under 10k files, there's no faster alternative - at least to my knowledge.

this is fast, since you don't have to acquire explicit locks on reads + don't have to purge page caches on every write - OS manages it for you.

## why not in-memory or s3

while we can switch over to an in-mem storage based solution too, i felt for a usecase like scheduler service, i'd let my brain cells focus more on reliability than latency. if you schedule for minutes ahead, an error percentage in seconds is well-acceptable. disc failures are less occurring than mem failure all the time.

so why not have a disc storage backed by s3? catastrophic idea i believe. since -

1. s3 won't give you idempotency on renames. that was one of the core design ideas i had, an atomic linux `rename()` protects against two workers picking up the same task at once, with at least once scheduling guarantee.
2. `ListBucket` is too cumbersome for finding the latest schedule unlike `readdir()`.

## leader-follower with raft

what i went ahead with instead was a leader-follower model, with followers keeping a replica, and leader owning a partition. we do a raft consensus, so in case of failovers one of the replica becomes the leader.

1. each replica once promoted, will continue to be the owner of the partition and received `Schedule()` requests.

2. logs will be relayed from follower → replica using a shared queue (the distributed queue i built quite a few weeks back came in handy ;P)

i did run a benchmark on latency and throttling, but that would follow in the next post. till then enjoy some aesthetics of the code i wrote for consensus.
