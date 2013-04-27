# Player class constructor
Player = (I={}) ->

  seeds = []

  # Default values that can be overriden when creating a new player.
  Object.defaults I,
    zIndex: 10

  # The player is a GameObject
  self = GameObject(I).extend
    draw: -> # NOOP
    gainSeed: ->
      seeds.push Seed.Primaries.rand()

  10.times ->
    self.gainSeed()

  addSeed = (position, seed) ->
    engine.add "Seed",
      color: seed
      x: position.x
      y: position.y

  self.on "update", () ->
    position = mousePosition

    if mousePressed.left
      if seed = seeds.shift()
        addSeed(position, seed)

    engine.find("Pickup").each (pickup) ->
      if position.distance(pickup.position()) < 10
        Sound.play "pickup#{rand(2)}"
        pickup.gain()
        self.gainSeed()

  self.on "overlay", (canvas) ->
    seeds.each (seed, i) ->
      if i is 0
        r = Math.sin(I.age / 2 * Math.TAU) * 3 + 3
      else
        r = 0

      canvas.drawCircle
        color: seed
        radius: 10 + r
        x: App.width - 30
        y: (i + 1) * 30

  # We must return a reference to self from the constructor
  return self
