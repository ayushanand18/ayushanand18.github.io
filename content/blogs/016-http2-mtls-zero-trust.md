---
date: '2026-10-11'
title: 'HTTP/2 Streams, mTLS and Zero-Trust Auth'
slug: 'http2-mtls-zero-trust'
description: 'Exploring zero-trust authentication at the transport layer - mTLS, per-connection client identity, HTTP/2 stream IDs, and how APNs combines both.'
tags:
  - Networking
  - HTTP/2
  - mTLS
  - Security
  - Zero Trust
---

![Wireshark HTTP/2 capture](/blog/016-http2-mtls-zero-trust-hero.jpg)

so, last week we hit an interesting problem, not one due to my bad humour, but it was an HTTP/2 stream that kept me awake for a couple of days. well, http/2 was built with keep-alive not keep-awake, haha. jokes apart, auth at the transport/application layer intrigues me the most in modern day.

## zero-trust environments

zero-trust environments is how we can describe most inter-service communication nowadays. there's mTLS which enables not just server identity verification (unlike TLS does), but also client verification. both the client cert and server cert identity is bound at the network layer. application layers inherit this identity so they don't need to do per-request authentication, most commonly envoy does this. for external service comms, almost everybody verifies them per-request using the very common OAuth 2.0.

## apple push notification service - combining both

but there's a class of zero-trust environments that move way beyond this by using a combination of both. APNs (apple push notification service) does this by allowing only one client identity per TCP connection, while also maintaining per-request short-lived jwt authentication. while the latter is pretty common, the former isn't well documented - and most often than not, most people wouldn't come across such a scenario in practical world.

## identifying connections deterministically

but how do you identify a connection deterministically? well, for any device on the internet a TCP connection between any two hosts can be deterministically determined (only at any of the hosts since one could easily anycast their IPs) - `src_ip x src_tcp_port x dst_ip x dst_tcp_port`.

each request b/w client and remote would get a stream_id (defined by stream_ids - always odd numbers initiated by client, and even numbers if by servers). it is a 31 bit integer - which simply suggests you can only fire up 1B requests before a connection needs to be recycled, but in real world, connections get recycled once it reaches thousands (due to TLS expiry/keepalive configs), client/server could send GOAWAY any day. QUIC (H/3) learnt this and they made it a 62-bit identifier.

well, that's it for this time as I ought to send a GOAWAY and get to sleep. meanwhile enjoy some wireshark aesthetics.
