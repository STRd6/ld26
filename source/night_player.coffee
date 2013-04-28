NightPlayer = (I={}) ->

  # Default values that can be overriden when creating a new player.
  Object.defaults I,
    seedPouch: []
    zIndex: 10

  # The player is a GameObject
  self = GameObject(I).extend
    draw: -> # NOOP

  addSeed = (position, seed) ->
    engine.add "Seed",
      color: Seed.Colors.first()
      radius: seed
      x: position.x
      y: position.y

  returnToTheLight = (->
    engine.delay 3, ->
      engine.setState Day()

    engine.delay 2.5, ->
      engine.fadeOut()

  ).once()

  self.on "update", ->
    position = mousePosition

    if mousePressed.left
      if seed = I.seedPouch.shift()
        addSeed(position, seed)

    if I.seedPouch.length is 0
      returnToTheLight()

  self.on "overlay", (canvas) ->
    canvas.drawRoundRect
      x: App.width - 50
      y: 5
      width: 40
      height: App.height - 10
      color: "rgba(128, 128, 128, 0.5)"

    I.seedPouch.each (seed, i) ->
      if i is 0
        r = Math.sin(I.age / 2 * Math.TAU) * 3 + 3
      else
        r = 0

      radius = (Math.log(seed) * 3 + r).clamp(5, 15)

      x = App.width - 30
      y = (i + 1) * 30

      canvas.withTransform Matrix.translation(x, y), (canvas) ->
        canvas.drawCircle
          color: Seed.gradient(radius, Seed.Colors.first(), canvas.context())
          radius: radius
          x: 0
          y: 0

  # We must return a reference to self from the constructor
  return self
