---
date: '2024-02-20'
title: 'Digging Up on DIG - The DNS Lookup Utility'
slug: 'dig-dns-lookup-utility-packet-analysis'
description: 'Packet analysis using Wireshark to understand how DNS queries work under the hood.'
tags:
  - Networking
  - DNS
  - Wireshark
  - Packet Analysis
  - Systems
---

so like many other weekends, i spent the last 2 days scratching my brain around an interesting problem - understanding how DNS actually works at the packet level. we all use `dig` and `nslookup` but what's really happening under the hood?

## The Setup

i decided to use Wireshark to capture DNS packets while running various `dig` commands. simple setup:
- my laptop
- wireshark running
- terminal open for `dig` commands

## Basic DIG Command

let's start with something simple:

```bash
dig google.com
```

what i expected: simple query-response
what i saw: way more interesting stuff

## Packet Analysis

### The Query Packet

looking at the Wireshark capture, the DNS query packet has some interesting fields:

```
Transaction ID: 0x1234
Flags: 0x0100 (Standard query)
Questions: 1
Answer RRs: 0
Authority RRs: 0
Additional RRs: 0
Queries: google.com: type A, class IN
```

### The Response Packet

and the response:

```
Transaction ID: 0x1234 (matches!)
Flags: 0x8180 (Standard query response, No error)
Questions: 1
Answer RRs: 1
Authority RRs: 0
Additional RRs: 1
Queries: google.com: type A, class IN
Answers: google.com: type A, class IN, addr 142.250.183.78
Additional: .: type OPT, UDP payload size 1232
```

## Interesting Observations

### 1. Transaction ID Matching

the transaction ID in query (0x1234) matches the response. this makes sense - it's how the client knows which response belongs to which query.

### 2. Additional Section

that `Additional RRs: 1` with the OPT record? that's EDNS0 - Extension Mechanisms for DNS. allows larger UDP payloads and more flags.

### 3. Multiple IPs

when i tried `dig google.com` again, sometimes i got different IPs. DNS load balancing in action!

## Trying Different Query Types

let's try something more interesting:

```bash
dig google.com MX
```

now we're asking for mail exchange records. the response looks different:

```
Answers: google.com: type MX, class IN, pref 10, mail server aspmx.l.google.com
        google.com: type MX, class IN, pref 20, mail server alt1.aspmx.l.google.com
```

## DNSSEC Experiments

what if we try DNSSEC?

```bash
dig google.com +dnssec
```

now we get additional records with RRSIG and DNSKEY. the packets get bigger, more complex.

## IPv6 DNS

```bash
dig AAAA google.com
```

asks for IPv6 addresses. the response format is similar but with 128-bit addresses instead of 32-bit.

## Recursive vs Iterative

here's something cool - when you query your local DNS server, it does recursive queries on your behalf. but between DNS servers, they use iterative queries.

i could see this in Wireshark when my DNS server queried other servers to get the final answer.

## Caching in Action

run the same `dig` command twice:

```bash
dig google.com
dig google.com
```

second time? much faster response. and in Wireshark, you might see fewer packets if the answer is cached locally.

## Fun with Wildcards

what happens when you query non-existent subdomains?

```bash
dig definitely-does-not-exist.google.com
```

sometimes you get NXDOMAIN (Non-Existent Domain), but sometimes you get wildcard responses from certain domains.

## The Real Learning

this exercise taught me:
1. DNS is more complex than it looks
2. Packet analysis reveals the actual protocol behavior
3. Caching and load balancing happen at the DNS level
4. Security features like DNSSEC add complexity but are necessary

## Next Steps

thinking of:
1. Analyzing DNS over HTTPS (DoH) packets
2. Looking at DNS over TLS (DoT)
3. Maybe setting up my own DNS server to see the other side

## Conclusion

was this practical? maybe not immediately. but understanding the fundamentals helps when you're debugging weird DNS issues or designing systems that rely heavily on DNS.

sometimes you need to go low-level to really understand what's happening.

---

*packet captures available if anyone wants to dive deeper into the actual DNS packets.*
