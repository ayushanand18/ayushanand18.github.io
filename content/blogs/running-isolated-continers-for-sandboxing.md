---
date: '2026-04-21'
title: 'Running Isolated Containers for Sandboxing'
slug: 'running-isolated-continers-for-sandboxing'
description: 'Running Isolated Containers for Sandboxing'
tags:
  - Networking
  - Sandboxing
  - Virtualization
  - Containerization
---

heya, its sunday 9pm my local time but my Go code running on a kerneld says its 2pm. well the host machine says 5pm, and my brain started to trigger sysrq because all of this started a chaos. (haha, i’m sorry for my bad jokes, but if you don’t know about sysrq do read this linux blog [1]).

so this week I started out solving a problem I had thought off quite a few weeks back - building isolated sandboxed environments. given the current times when we are spawning ai agents here and there, there’s a dire need. 

my first guess was containerization via docker. but i quickly realised that they are not security sandboxes; they are processes with a shared kernel, best used for reproducibility and lightweight isolation. most of the security isolation could be solved by running processes in userspace. why not have user-space kernels?

so i started off with building my own isolated containerization tool, thats sort of very restrictive and suited for such workflows, while also not being a full-blown VM. here are some initial problems I ran into -

1. network access - each container should be restricted from opening host sockets. start an AF_PACKET socket with the host machine, and implement the whole network stack on the container. AF_PACKET, if you don’t know, allows us to trade in raw packets at L2. or could even use AF_XDP (post Linux Kernel v4.18+).

2. reading/writing to disk - each container should mount its separate path from the host fs. grant read/write privileges for the process on the path, that restricts containers from colluding in each other’s fs. ptrace every fd open, and attach O_NOFOLLOW flag. this makes sure that processes inside containers cannot do .. and drop into the root fs anyhow. adds a little overhead on each syscall, but makes sure root fs is strictly not accessible.

3. hardware acceleration - this is the trickiest part, since each hardware has its own proprietary kernel driver. the simplistic approach is to package a proxy, that talks to all these devices on host using ioctl(2) [ioctl takes in fd of the device, op code and pointer to the data memory location]. although ABIs are known to be obscure and inconsistently stable across release versions, especially with NVIDIA.

by the end of my search for answers to these questions, all of my brain cells ran into low energy. and ever since these hot summers have started, I have begun to feel that I’m running on 2% lesser energy efficiency. well nevermind, i’ll share the implementation details i started off with in the following posts. 

but by then enjoy this interesting anecdote behind manpages on linux.
