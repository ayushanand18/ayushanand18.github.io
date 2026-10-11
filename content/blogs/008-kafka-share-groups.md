---
date: '2026-10-11'
title: 'Kafka Share Groups - Using Kafka as a Real Message Queue'
slug: 'kafka-share-groups'
description: 'Kafka share groups (KIP-932) finally let multiple consumers read from the same partition concurrently - treating Kafka as a proper message queue.'
tags:
  - Kafka
  - Distributed Systems
  - Message Queues
  - KIP-932
---

![Kafka Share Groups](/blog/008-kafka-share-groups-hero.jpg)

yo, so this week few of my brain cells just exclaimed wow out of excitement. for a long time, we treated kafka - a log system as a message queue. taking advantage of different consumer groups being able to read the same partition at different offsets, we could maintain different groups of queue consumers to maintain a track of which message they have read. my brain just felt it was an exciting update to kafka.

## the problem with consumer groups

since there's a limitation on only 1 consumer being able to read messages from a partition in a consumer group, dequeing at a concurrency greater than partition count meant polling messages in a fire-and-forget async thread or maybe creating a new consumer group with suffixes - something which needed to be coordinated by the application.

## share groups (KIP-932)

although it is currently in dev preview feature in [KIP-932](https://cwiki.apache.org/confluence/display/KAFKA/KIP-932), but the caveats are interesting -

1. all consumers part of the same group share the same `group.id`, and participate in rebalancing just like producer.

2. when a consumer receives a message using the standard `poll(Duration)`, it acquires a time-limited acquisition lock, by default 30s. this is just like the visibility timeout in aws sqs, for the duration, a polled message is not visible to other consumers. this is adjustable via [group.share.record.lock.duration.ms](https://lnkd.in/dFkEq_Tg).

3. the consumer can then acknowledge successful processing of the record (commit), or release it for others, or maybe reject the record and wait for the visibility timeout.

4. the difference is that, a consumer can have multiple acquired messages without committing at any moment, but limited to `group.share.record.lock.partition.limit` - this can help us build commodity workers horizontally expand to consume messages from a topic not limited to the max partition count.

## why this matters

the added advantage of this not handling via consumer code is that kafka guarantees processing of acknowledgement to be atomic, so that error handling is straight-forward.

well, i am just too excited for this to be out of early-access and released soon. what about you?
