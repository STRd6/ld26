Universe = (I={}) ->
  Object.reverseMerge I,
    color: "white"
    radius: App.width / 2 + 60
    x: App.width/2
    y: App.height/2
    zIndex: -100

  self = GameObject(I).extend
    expand: (n) ->
      I.radius += n * (1 + (I.age / 30).floor())

  self.attrReader "radius"

  self.on "update", (elapsedTime) ->
    # Contract constantly
    if I.age < 120
      rate = 2
    else if I.age < 180
      rate = 3
    else if I.age < 240
      rate = 6
    else if I.age < 300
      rate = 9
    else
      rate = 12

    self.expand(-rate * elapsedTime)

    noneLeft = !engine.find("Seed").inject false, (anyLegit, seed) ->
      anyLegit || seed.colorNum() != 7

    if noneLeft and I.age > 30
      self.expand(-4 * elapsedTime)

    engine.find("Seed").each (seed) ->
      # Skip darkness, light, and purples
      n = seed.colorNum()
      return if n is 7 or n is 0 or n is 5

      delta = self.position().subtract(seed.position())

      seed.I.radius = seed.I.radius.clamp(0, I.radius - delta.length())

  gatherSeeds = ->
    engine.find("Seed").map (seed) ->
      radius = seed.radius()

  self.on "afterUpdate", ->
    if I.radius <= 0
      I.radius = 0

      night.I.seedPouch = gatherSeeds()
      engine.setState night

    if justPressed.f1
      night.I.seedPouch = gatherSeeds()
      engine.setState night

  return self
