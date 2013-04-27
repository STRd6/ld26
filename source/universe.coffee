Universe = (I={}) ->
  Object.reverseMerge I,
    color: "white"
    radius: App.width / 2 + 60
    x: App.width/2
    y: App.height/2
    zIndex: -100

  self = GameObject(I).extend
    expand: (n) ->
      I.radius += n

  self.on "update", (elapsedTime) ->
    I.radius -= 2 * elapsedTime

    engine.find("Seed").each (seed) ->
      # Skip darkness
      n = seed.colorNum()
      return if n is 7 or n is 0

      delta = self.position().subtract(seed.position())

      seed.I.radius = seed.I.radius.clamp(0, I.radius - delta.length())

    if I.radius <= 0
      I.radius = 0
      ; # End it, eat your black cherries

  return self
