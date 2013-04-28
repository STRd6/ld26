Night = (I={}) ->
  Object.reverseMerge I,
    seedPouch: []

  self = GameState(I)

  self.on "enter", ->
    engine.fadeIn()

    engine.add "NightPlayer",
      seedPouch: I.seedPouch

    engine.add "Message",
      text: "lost"
      x: App.width / 2
      y: App.height / 2

    engine.add "Message",
      text: "found"
      x: App.width - 80
      y: 170

    [
      "please"
      "see clearly"
    ].each (message, i) ->
      engine.add "Message",
        text: message
        x: App.width - 180
        y: 90 - i * 20

    [
      "All progress"
      "arrives after"
      "total surrender."
    ].each (message, i) ->
      engine.add "Message",
        text: message
        x: App.width - 400 + i * 50
        y: App.height - 50 - i * 30

    [
      "Meaning is the relationship"
      "between context and events."
    ].each (message, i) ->
      engine.add "Message",
        text: message
        x: 150 + i * 50
        y: 200 + i * 40

  return self
