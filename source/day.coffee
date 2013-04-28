Day = (I={}) ->
  self = GameState(I)

  self.on "enter", ->
    engine.fadeIn()

    engine.add "Universe"

    engine.add "Player",
      x: App.width/2
      y: App.height/2

  return self
