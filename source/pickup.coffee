Pickup = (I={}) ->
  self = GameObject(I).extend
    gain: ->
      # TODO Animate
      self.destroy()

  self.on "update", (elapsedTime) ->
    I.color = ["white", "black"].wrap((I.age / 0.25).floor())

  return self
