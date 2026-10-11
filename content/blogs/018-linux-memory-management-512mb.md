---
date: '2026-10-11'
title: 'Fitting 800MB of Active Usage onto 512MB RAM'
slug: 'linux-memory-management-512mb'
description: 'Running Chromium and multiple services on a 512MB RAM machine - OOM scores, zram, swap tuning, and manual memory management on Linux.'
tags:
  - Linux
  - Memory Management
  - Systems
  - Performance
---

so, for quite a few weeks i have tried to bore myself with running random-looking experiments to share knowledge nobody asked for. last week, i missed following this ritual because i was stuck making a system stable, which was running under significant memory pressure.

although it would be too fancy to say that i care about latency a lot, because in reality i care about memory even more. it was an excess of thinking through NUMA fairly simply when machine memory is under stress.

my very own "distributed" service which uses my very own queue implementation, and my very own http server library was feeling memory pressure, because it had multiple instances running on the same tiny 512MB RAM machine. although it looks huge on paper, and the case might be, but chromium itself requires 1GB of available RAM to render GUI. critical for my use case, my goal was to enable chromium to run in <200mb of RAM, without disabling JS, and media on any webpage, alongside tens of other processes in this tiny machine - sorry i am a bit tight on budget for compute and memory.

## oom scores

linux by default kills processes when the available RAM and swap space are about to be filled. it does so by prioritizing killing of processes that have spawned relatively recently + major memory allocators. you can in fact view an OOM score of a process, by viewing the `/proc/<pid>/oom_score` file. [1 - attaching an interesting stackoverflow thread].

## swap and zram

memory swap exists for a reason. everybody knows that OS starts thrashing pages out of RAM and swaps them to disc, when it feels that either they are no longer being used, or there's not enough space on RAM. one can look at the policy of swapping pages in `/proc/sys/vm/swappiness` file.

often there's a misconception, that to fit in a process having a larger memory than available, pages need to be swapped to disc. this is largely true, even i had, but you can even swap to a compressed partition on RAM. this is called zram - its a linux utility that picks up a partition on RAM, and when enabled swap on it, it will not store the page swaps on disc, but compress it and store in RAM itself. although compression comes with an overhead, but not as much as disc I/O.

just choose your algorithm, partition size, and enable the swap on zram partition -

```bash
modprobe zram
echo lz4 > /sys/block/zram0/comp_algorithm
echo 150M > /sys/block/zram0/disksize
mkswap /dev/zram0
swapon /dev/zram0
```

## fitting chromium in

people would argue that there are many better ways to reduce the active memory usage by using lazy loading/mmaps, and so on; but the primary constraint for my use case was trying to fit chromium on that tiny device. since chromium required the highest memory, my other processes worked fine, but chromium kept getting OOM killed, because as soon as it would render a heavy JS page, the requirement would exceed the available swap space on disc. hey, i'm not saying chrome is a resource hog (although I am), but my resources are a bit more limited and had to architect around it. eventually I had to increase the disc swap size to 2.4gb since i could have multiple swap locations.

## tuning the kernel

the other tiny hack i found was to reduce `vm.overcommit_memory` ratio, it is the proportion in which OS tries to free memory whenever a new allocation is requested, so that future allocations are not stalled. i reduced it since i had a very predictable memory pattern (and i had to control by architecting my code around this assumption).

linux often does swapping on direct allocations request, but might also do so asynchronously through the thread `kswapd`, each NUMA node having one.

## manual cache management

most of the times what an OS does for you is good enough to never look for another solution, but sometimes you have to manage things up yourself. manual memory management is quite fun. for example, whenever i had to boot up chromium (or say any other task), there would be a time between my other processes to run other CPU bound tasks and not read files from disc; that is when i used to purge file-backed caches so that when chromium boots up, kernel doesn't have to run direct reclaim on allocations, memory was already freed up and available for it to function, driving the latency down. file-backed caches could easily be built with much lesser latency spike. but this is largely true since i had 1 process demanding > 40% of memory (well nearly 60% to be honest).

```bash
echo 1 > /proc/sys/vm/drop_caches
```

well this is it for the time. isn't it quite fun to manage your shit on your own? [i meant by memory though :)]
