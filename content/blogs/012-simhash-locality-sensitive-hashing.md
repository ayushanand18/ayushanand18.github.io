---
date: '2026-10-11'
title: 'Simhash and Locality Sensitive Hashing'
slug: 'simhash-locality-sensitive-hashing'
description: 'Stumbled upon simhash - a locality sensitive hashing technique used by Google for VisualRank, and built a naive implementation.'
tags:
  - Algorithms
  - Hashing
  - Search
  - LSH
---

![Simhash Implementation](/blog/012-simhash-lsh-hero.jpg)

heya, this weekend i was searching for more problems because life is short and my to-do list was out here writing a novel. hmm, over these years i have figured out that everything can be reduced to a search problem. trying to find a solution to a math problem? first thing you do is find similar problems you'd have solved previously out of memory before typing it out on google. trying to shop for a party? you start with searching fashion trends, and go on a lookout for those designs in a handful of stores you care about.

life could be made better if we optimize on the search algorithm we use. and by the virtue of my continued search i randomly came by a wikipedia page, that said simhash. well, then i read simhash is a locality sensitive hashing technique. wait what even are they?

## locality sensitive hashing

locality sensitive hashing (LSH), is a fuzzy-hashing technique that hashes similar inputs to the same bucket with a high probability. this is useful when you want to search similar items - say find similar images when you do a google lens. in fact google uses simhash in visualrank (just like pagerank but for images), to show you relevant images even when the text associated with the image source is vague/unrelated to the image.

## how simhash works

what simhash simply does is, take an input sentence say a length of words, tokenizes it (replacing punctuations if necessary). now for each token, you obtain its hash of constant length say 64 bits, and compute a final binary which has a bit as set only if majority of the tokens' hashes had that bit position set.

distance between two lengths of strings would be the hamming distance between their simhashes. this could be repeated for a length of sentence where words would be tokens, or for images where features or blocks of pixels could be tokens.

## why it's useful

this is super useful, because each token can be individually processed, and thus parallelized using map-reduce or similar approaches.

a pretty simple algorithm, but works fabulously while being damn fast. of course, this opens doors for a family of LSH algorithms - which i will deep dive further in the coming weeks. meanwhile, have some fun viewing the aesthetics of a naive implementation i did?
