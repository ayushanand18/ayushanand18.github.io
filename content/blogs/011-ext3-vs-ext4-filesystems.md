---
date: '2026-10-11'
title: 'ext3 vs ext4 - Why Pauses Matter in Filesystems'
slug: 'ext3-vs-ext4-filesystems'
description: 'Reading about ext3 and ext4 filesystems - timestamps, journaling, and why ext3 was expensive to adopt on commodity hardware.'
tags:
  - Filesystems
  - Linux
  - ext3
  - ext4
  - Systems
---

![ext3 vs ext4 Filesystems](/blog/011-ext3-ext4-filesystems-hero.jpg)

hello. for the last two weeks, i didn't post anything here. i took a pause - a quite significant one. pauses are significant, because that's what made ext3 expensive to adopt, and led people to develop ext4 for the new linux. ext3 - quite a famous FS back then, doesn't batch writes and allocates space on disk as soon as data is written.

well, i was reading a ton of data from commodity hardware, when i felt that it was a snail - taking eternity to complete the i/o. but filesystems are an interesting piece of art. in fact every FS has its own interesting story to tell. ext3 too has one.

## the year 2038 problem

ext3 had max date range for files as 2038 - so any file saved beyond that date would simply overflow to pre-1970s. crazy right, ext4 fixed it and moved it to 2446. even crazier, the fix was hacky. people utilized 2 unused bits from the inode's `i_ctime_extra`/padding fields to extend epoch time, and still didn't switch to 64-bit timestamps in ext4. they simply took this approach since it would be the most backwards compatible fix without ruining data on-disk.

## timestamp precision

ext3 stores timestamps as 32-bit signed integer. so every timestamp field (atime, mtime, ctime) was a plain 32-bit signed int counting seconds since the unix epoch. obvious question, that could lead to catastrophic outcomes on a networked file system. if two file operations happened within the same second, ext3 literally couldn't distinguish which came first. build systems (make, compilers) rely on mtime comparisons to decide what needs rebuilding. ext4 simply added another 32 bits for storing nanosecond precision. clever enough workaround.

## journaling and i/o contention

ext3 commonly ran in ordered or even journal mode, where metadata (and sometimes data) gets written twice - first to the journal, then to the final location. this creates I/O contention, and under heavy write load, reads can stall waiting for journal commits to flush. this used to commonly cause system freezes on ext3, since fsync was taking considerable time.

## what's next

interestingly, there's a shit ton of optimizations one can do to make their workload performative for anyone running their compute on commodity hardware (as I am). a lot of interesting work in works for the coming weeks, which i'll definitely yapp around here. till the time, glance through the graphic above explaining fs interaction with linux kernel.
