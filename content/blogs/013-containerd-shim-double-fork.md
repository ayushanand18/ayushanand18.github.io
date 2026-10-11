---
date: '2026-10-11'
title: 'containerd-shim and the Double Fork Trick'
slug: 'containerd-shim-double-fork'
description: 'How containerd-shim uses the classic double fork to detach from its parent and survive containerd/dockerd restarts.'
tags:
  - Docker
  - Containers
  - Linux
  - Processes
  - OCI
---

![Docker container lifecycle](/blog/013-containerd-shim-double-fork-hero.jpg)

heya, last week i got distracted. of course i do not doomscroll, but i did get distracted by runc. it was last sunday that i wrote about how an interesting vulnerability in runc led to root access in the host machine via non-rootful malicious docker images.

## the docker lifecycle

that led me down to a complete rabbithole of what the OCI spec says of docker processes and utilities. when docker spawns a new container, it follows this set of pipeline.

```
docker → dockerd → containerd → containerd-shim → runc → container
```

## containerd-shim

but it's not simple as it seems to be. containerd-shim is a thin lightweight process, with mostly the only purpose being able to sustain even when its manager (containerd/dockerd restarts), so that the container process does not exit. it might become a zombie process, and eventually get reaped by init, but it doesn't.

this happens because when containerd starts a shim, the shim process detaches itself by calling `setsid()` immediately, leaving containerd's process group/session entirely. it then re-parents itself so it's not a child of containerd anymore. but how does that happen? a double `fork()`, and there lies the trick.

## the double fork

say a process A forks process B, with a single fork, B is still in the same session and process group. if B calls `setsid()`, since it isn't the leader of a session (A might be the leader, as the parent of fork), it becomes leader of a new session. now, B does a fork again say becomes C, and now exits immediately. since C is orphaned, it gets assigned to Init (PID 1).

but why do we need the 2nd fork? 1st fork could also make it orphan. hmm, yes but we'd require detachment from terminal related signals too, so that it becomes fully independent of A. because C's session becomes leaderless, it can't acquire a controlling terminal.

interesting way to do a workaround to escape a bottleneck, just so that the requirements become the side-effects. meanwhile, in case you want to understand a bit more on the processes mentioned in the above lifecycle, glance through the informative graphic above from Ivan Velichko.

thanks for bearing with me btw.
