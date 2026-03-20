---
date: '2026-03-20'
title: 'Managing your own servers on cloud/bare metal'
slug: 'managing-servers-on-bare-metal'
description: 'Rewriting a storage engine for graph databases, i build sometime back in C++ to Golang.'
tags:
  - Storage Engine
  - Golang
  - LSM Trees
  - Graph Databases
---

## introduction
managing one's own servers on cloud or bare metal is actually not an easy job. a lot of times it could feel like
clueless, and not knowing how to manage costs effectively. here's what i do to manage my deployments, and 
production instances.

## how i manage my pipeline
1. ci builds are trigerred via github. and executed on github actions.
2. the build file is then ssh-ed to running instances on ec2.
3. i have a systemd script to reload and run the processes, i need on every restart.
