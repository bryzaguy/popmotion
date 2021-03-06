---
title: Tween
description: Change a value over a specific duration of time.
---

# Tween

`tween(props <Object>)`
`tween(from <Number>, to <Number>, duration <Number>, ease <Function>, props <Object>)`

## Methods

### `getElapsed`
Get the elapsed time of the tween.

### `flip`
Flip the tween's `from` and `to`.

### `reverse`
Reverse the tween's progress through time.

## Props

- `duration <Number>`: The amount of time for the tween to take, in milliseconds.
- `ease <Function>`: Easing function.
- `from <Number>`: The number to tween from. (default `0`)
- `to <Number>`: The number to tween to. (default: `1`)
- `flip <Number>`: Number of times to flip tween on tween complete. (default: `0`)
- `loop <Number>`: Number of times to restart tween from beginning on tween complete. (default: `0`)
- `yoyo <Number>`: Number of times to reverse tween on tween complete. (default: `0`)
