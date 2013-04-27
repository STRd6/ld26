# Player class constructor
Player = (I={}) ->

  seeds = [
    Seed.Primaries[0]
    Seed.Primaries[2]
    Seed.Primaries[0]
    Seed.Primaries[2]
    Seed.Primaries[1]
  ]

  # Default values that can be overriden when creating a new player.
  Object.defaults I,
    zIndex: 10

  # The player is a GameObject
  self = GameObject(I).extend
    draw: -> # NOOP
    gainSeed: ->
      seeds.push Seed.Primaries.rand()

  5.times ->
    self.gainSeed()

  canPlaceSeed = (position) ->
    engine.find("Seed").inject true, (free, seed) ->
      free and !(position.distance(seed.position()) < seed.radius())

  addSeed = (position, seed) ->
    engine.add "Seed",
      color: seed
      x: position.x
      y: position.y

  self.on "update", () ->
    position = mousePosition

    if mousePressed.left
      if canPlaceSeed(position)
        if seed = seeds.shift()
          addSeed(position, seed)

    engine.find("Pickup").each (pickup) ->
      if position.distance(pickup.position()) < 10
        # Sound.play "pickup#{rand(2)}"
        pickup.gain()
        self.gainSeed()

  self.on "overlay", (canvas) ->
    canvas.drawRoundRect
      x: App.width - 50
      y: 5
      width: 40
      height: App.height - 10
      color: "rgba(128, 128, 128, 0.5)"

    seeds.each (seed, i) ->
      if i is 0
        r = Math.sin(I.age / 2 * Math.TAU) * 3 + 3
      else
        r = 0

      radius = 10 + r

      x = App.width - 30
      y = (i + 1) * 30

      canvas.withTransform Matrix.translation(x, y), (canvas) ->
        canvas.drawCircle
          color: Seed.gradient(radius, seed, canvas.context())
          radius: radius
          x: 0
          y: 0

  # We must return a reference to self from the constructor
  return self
