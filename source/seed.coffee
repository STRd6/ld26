Seed = (I={}) ->

  genTime = 5

  Object.reverseMerge I,
    radius: 10
    color: Seed.Colors.rand()
    timer: genTime
    lightness: false

  I.n = Seed.Colors.indexOf(I.color)

  self = GameObject(I).extend
    colorNum: ->
      I.n

    compatible: (other) ->
      !(self.colorNum() & other.colorNum())

    collisionFn: (n, m) ->
      if n is 0 or m is 0
        lightTheNight
      else if n is 7 or m is 7
        if n is m
          ->
        else
          darknessSpreads
      else if n is 3 or m is 3
        if n & m
          fireHealsAll
        else
          friendsOrFoes
      else if n is 2 and m is 2 # Yellows join
        merge
      else
        friendsOrFoes

  seedCollide = (fn) ->
    Collision.collide "Seed", self, (other, self) ->
      if other != self
        fn(other, self)
    , (a, b) ->
      Collision.circular(a.circle(), b.circle())

  illuminate = (seed) ->
    if seed.colorNum() is 7
      seed.destroy()

  lightTheNight = (other, self) ->
    illuminate(other)
    illuminate(self)

  fireHealsAll = (other, self) ->
    if other.I.radius + self.I.radius > 100
      # Light the universe
      other.I.n = 0
      self.I.n = 0
      other.I.color = Seed.Colors.first()
      self.I.color = Seed.Colors.first()

    merge(other, self)

  friendsOrFoes = (other, self) ->
    if self.compatible(other)
      merge(other, self)
    else
      antagonism(other, self)

  merge = (other, self) ->
    self.destroy()
    other.destroy()

    x = self.colorNum()
    y = other.colorNum()

    # p = Point.centroid(self.position(), other.position())

    if self.radius() > other.radius()
      p = self.position()
    else
      p = other.position()

    n = x | y

    engine.add "Seed",
      color: Seed.Colors[n]
      x: p.x
      y: p.y
      lightness: n is 0
      radius: I.radius + other.I.radius

  antagonism = (other, self) ->
    self.I.radius -= 10
    other.I.radius -= 10

  addPickup = ->
    p = Point.random().scale(50)

    engine.add "Pickup",
      x: I.x + p.x
      y: I.y + p.y

  darknessSpreads = (other, self) ->
    other.I.n = 7
    other.I.color = Seed.Colors.last()

  self.on "update", (elapsedTime) ->
    return unless I.active

    n = self.colorNum()
    switch n
      when 0
        if universe = engine.first("Universe")
          I.radius -= 3 * elapsedTime

          universe.expand(3 * elapsedTime)
        else
          # Outside the universe

      when 1 # Red
        I.radius += 10 * elapsedTime

        if I.radius >= 100
          engine.camera().shake()

          # Sound.play "explosion0"

          3.times addPickup
          self.destroy()
      when 2 # Yellow
        ;
      when 3 # Orange
        ;
      when 4 # Blue
        I.radius += 2 * elapsedTime
      when 5 # Purple
        ;
      when 6 # Green
        I.timer -= elapsedTime

        if I.timer <= 0
          I.timer = genTime
          addPickup()

        I.radius -= 2 * elapsedTime
      when 7 # black
        engine.first("Universe")?.expand(-elapsedTime)

        I.radius -= elapsedTime

    seedCollide (other, self) ->
      self.collisionFn(other.colorNum(), self.colorNum())(other, self)

  self.on "afterUpdate", ->
    I.radius = I.radius.clamp(0, Infinity)

    if I.radius <= 5
      self.destroy()

  self.unbind "draw"
  self.on "draw", (canvas) ->
    if I.n is 0
      I.alpha = Math.sin(I.age * Math.TAU).clamp(0.01, 0.5)
      I.color = Color(255, 255, 215, 0)
      I.zIndex = 500

    canvas.drawCircle
      x: 0
      y: 0
      radius: I.radius
      color: Seed.gradient(I.radius, I.color, canvas.context())

  self.attrReader "radius"

  return self

Seed.ColorNums = [
  0b000
  0b001
  0b010
  0b011
  0b100
  0b101
  0b110
  0b111
]

Seed.Colors = [
  "white"
  "red"
  [224, 224, 0]
  "orange"
  "blue"
  "purple"
  "green"
  "black"
].map (name) ->
  if name.isString?()
    Color(name)
  else
    Color.apply(null, name)

Seed.Primaries = [
  Seed.Colors[1]
  Seed.Colors[2]
  Seed.Colors[4]
]

Seed.gradient = (radius, color, context) ->
  t = radius / 3
  radgrad = context.createRadialGradient(-t, -t, 0, 0, 0, radius)

  a = 0.75
  edgeAlpha = 1

  [r, g, b] = color.channels()

  radgrad.addColorStop(0, "rgba(255, 255, 255, #{a})")

  [r1, g1, b1] = [r, g, b].map (n) ->
    (n * 11 / 7).clamp(0, 255).floor()

  radgrad.addColorStop(0.5, "rgba(#{r1}, #{g1}, #{b1}, #{a})")

  # radgrad.addColorStop(0.5, "rgba(#{r}, #{g}, #{b}, #{a})")

  [r, g, b] = [r, g, b].map (n) ->
    (n * 7/8).floor()

  radgrad.addColorStop(0.9, "rgba(#{r}, #{g}, #{b}, #{a})")

  [r, g, b] = [r, g, b].map (n) ->
    (n * 7/8).floor()

  radgrad.addColorStop(1, "rgba(#{r}, #{g}, #{b}, #{edgeAlpha})")

  radgrad
