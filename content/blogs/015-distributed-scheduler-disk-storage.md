---
date: '2026-10-11'
title: 'Building a Distributed Scheduler - Disk-Based Storage'
slug: 'distributed-scheduler-disk-storage'
description: 'Experimenting with a disk-based distributed scheduler using partitioned file storage, atomic renames, and sorted filenames for constant-time polling.'
tags:
  - Distributed Systems
  - Golang
  - Scheduling
  - Systems
---

![Distributed Scheduler Disk Storage](/blog/015-distributed-scheduler-disk-hero.jpg)

so this weekend we had a splash of rain hitting delhi finally. after all this prolonged heat wave, the rains turned on the perfect vibes, perfect vibes to open my perfect neovim configs and write yet another piece of art.

its a waste to the soothing petrichor, if i didn't do justice to at least one experiment out of the pretty decent list i have accumulated since past 14 months. some people call it backlog, i call it "someday I'll complete all this" list. but anyways, on top of this list was implementing a distributed scheduler.

## core requirements

the core requirements were having the ability to schedule a particular trigger for a specific time in UTC, and having an event fired at the timestamp specified. it should support breadth of time, spanning from few minutes to a couple of weeks.

## experiment 1 - in-memory sorted list

i started off with creating a sorted list in-memory, and blocking reads. since the list would be sorted on unix timestamp, the tickers would trigger the latest available schedule taking constant time to determine if an event really needs to be triggered. but most obviously, this reliable power goes off or the process exits, the schedule gets lost. anybody could take a blind guess that no process could reliably run beyond a couple of days.

## experiment 2 - disk-based scheduler

my second experiment was implementing a disk-based scheduler. `Schedule()` method writes individual events to disc, and the poller polls the latest events. since, we'll have to maintain a sorted order, a naive approach would easily fail since disk reads are significantly costly. so, i came up with this idea that every cheap horizontal worker will have its own mount and partition on a disk. each event will create a file on the mount x partition, with the filename being `{20-digit-unix-ns}_{uuid}.json`.

## partitioning strategy

we determine partitions by the approximate schedule time, events < few minutes will be in partition A, while few minutes-few hours will land in a different partition than those scheduled for a couple of days. one obvious assumption is that the schedule would be uniformly distributed, which i assume in a universal workload would be.

## atomic operations

every pop command for latest schedule would just be a read directory, claiming a process would just be an atomic `rename()`, no needs for file locks. processing/success means a rename to a different partition say `pending/` to `completed/`. the 2nd process would automatically fail in renaming.

partitions with the right threshold would ensure `ReadDir` don't take up much time as events increase. but there were a couple of more nuances in the experiment, which i'll share in the follow-up post. meanwhile, here's a piece of art for you to enjoy in these rains.
