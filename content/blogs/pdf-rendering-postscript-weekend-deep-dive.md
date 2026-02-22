---
date: '2024-02-18'
title: 'PDF Rendering and PostScript - A Weekend Deep Dive'
slug: 'pdf-rendering-postscript-weekend-deep-dive'
description: 'Spent a weekend understanding how PDFs work under the hood - PostScript, text rendering, and the Turing-complete nature of PDFs.'
tags:
  - PDF
  - PostScript
  - Systems Programming
  - Go
  - Graphics
---

so like many other weekends, i spent the last 2 days scratching my brain around an interesting problem, reading raw PDF bytes and figuring out how one renders on screen. interestingly, i learnt that PDFs use a "graphical description" language - PostScript (although modern PDF spec is a subset of it), which is turing-complete. one could easily implement anything in the world they can dream of on a PDF! (of course if the renderer of your choice supports the spec).

funnily enough, all this goes back to history of the language - when it was used for telling printers how to literally "draw" vectors/lines/text on a page. so the script tells the print head whether to move left/right/top/down and/or which position (x, y) on page, in the next command.

## The PostScript Example

for example, to print "Hello" on a page the script would go like -

```
/Helvetica findfont
24 scalefont
setfont
100 700 moveto
(Hello) show
showpage
```

break this down:
- `/Helvetica findfont` - find the Helvetica font
- `24 scalefont` - scale it to 24 points
- `setfont` - set it as current font
- `100 700 moveto` - move cursor to position (100, 700)
- `(Hello) show` - draw the text "Hello"
- `showpage` - render the page

## Why Did I Do This?

one would wonder, but what did i do? and ask me to "go get a life bro - spend your time outside on a weekend!" yeah, i know but when i hear a language being turing-complete it interests me beyond measure. i just get too excited.

a couple of months back i fell into the rabbit hole of how text is drawn on a PDF, and i happen to come across another use case where i needed to grab text from PDFs this week. and that is when i decided to understand the spec, and playfully write my own Go lib to render it.

## The Nuances

this sounds simple on paper but is actually nuanced. here's why -

### 1. Text as Vectors

rendering text on pdf is similar to drawing vectors/characters. as we saw, text is just another drawing operation.

### 2. Chunked Text

text is usually chunked, and a single line could be split and put in 5 different places with each having a "moveto" direction on top, so one would possibly need to literally "render" the whole script before finding even the first line.

## The Experiment

so i began the experiment, and wrote a text extraction lib as the starting point. there were some cool nuances with it too -

### 1. Reading the Spec

the usual, i had to read the full spec before even being able to begin. the PDF spec is... massive. like 1000+ pages massive.

### 2. Glyph Space Units

i messed up with something called "glyph space units" initially, causing weird spaces between words. so postscript follows cartesian system strictly to deal with positions and spaces. if you forget to apply the adjustment (font-size and scaling) you'd end up adding spaces to the multiple of 1000x, which I did.

### 3. Security Concerns

however interesting all this may be, but i realised that if pdf allows you to write an algorithm using stacks, it could lead to arbitrary code executions, and a very possible attack vector.

## The Go Implementation

here's a simplified version of what i ended up with:

```go
type TextExtractor struct {
    currentPage int
    fonts      map[string]Font
    stack      []float64
}

func (te *TextExtractor) ProcessCommands(commands []string) {
    for _, cmd := range commands {
        switch cmd {
        case "moveto":
            x := te.pop()
            y := te.pop()
            te.moveTo(x, y)
        case "show":
            text := te.popString()
            te.showText(text)
        // ... more commands
        }
    }
}

func (te *TextExtractor) showText(text string) {
    // Apply current font transformations
    // Convert glyph space to user space
    // Extract actual text content
}
```

## Next Steps

so next weekend i'd be spending time sanitizing pdfs before/during rendering. the security implications are non-trivial.

## Why This Matters

find postscript interesting? thanks to Adobe. read more on it on wikipedia [1]

but more practically, understanding this helps with:
- PDF text extraction (my original use case)
- PDF generation
- Security analysis of PDFs
- Understanding document rendering systems

## The Rabbit Hole

what started as a simple text extraction problem led me down this rabbit hole of:
- PostScript language basics
- PDF internal structure
- Font rendering systems
- Coordinate space transformations
- Security implications of turing-complete document formats

## Conclusion

was this practical? maybe not immediately. but understanding how things work at the fundamental level is what makes engineering interesting.

sometimes you need to go deep to understand the surface.

---

*references:*
*[1] PostScript on Wikipedia - https://en.wikipedia.org/wiki/PostScript*
*[2] PDF Security Considerations - upcoming research*

*code will be open-sourced once i clean it up a bit more.*
