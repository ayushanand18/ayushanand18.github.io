---
date: '2026-10-11'
title: 'Writing a VCR Package in Go'
slug: 'vcr-package-in-go'
description: 'Built a VCR (video cassette recorder) package in Go for recording and replaying HTTP traffic in tests, inspired by pytest-recording and vcr.py.'
tags:
  - Golang
  - Testing
  - HTTP
  - Open Source
---

![VCR Package in Go](/blog/010-vcr-package-go-hero.jpg)

heya, so for quite a few weeks i had been pushing around this one idea. pushed for so long that the stack was about to overflow. haha, jokes apart, this weekend i wrote a vcr package in go. inspired by pytest-recording, which i extensively used while developing python packages quite a few years back, i always felt like writing my own.

## background

pytest-recording uses vcr.py, which is a simple python package that records http API traffic which can then be easily mocked and replayed. say if you have unittests that involve external services, you can easily mock the external traffic and make your tests run independently of the api.

## implementation approaches

there are multiple ways which i came across for the implementation -

1. exposing a `net/http` client wrapper struct that saves all `http.Request` and `http.Response` objects.
2. intercepting and capturing traffic by defining my own `http.Transport`, and asking clients to use this transport instead of default/custom transport.
3. exposing a middleman (MITM) that intercepts traffic at network level.

among these 3, i figured out 2nd made the most sense and simplistic in usage. because those who are going to use a vcr would own the code using it as well.

## usage

so i went ahead and created a vcr lib that could easily be used like -

```go
import "github.com/ayushanand18/yavcr"

transport, err := yavcr.New(
 yavcr.WithCassette("github-api"),
 yavcr.WithMode(yavcr.ModeRecord),
)
client := &http.Client{Transport: transport}
```

this would make it a plug-and-play lib, with record mode, the traffic gets saved to a yaml file, and with replay mode, the request is matched with recorded yaml and response served directly.

here's the piece of art i coded out. time to get back to work!
