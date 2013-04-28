#= require_tree .

canvas = $("canvas").attr(
  width: App.width
  height: App.height
).pixieCanvas()

window.engine = Engine
  backgroundColor: Color("black")
  canvas: canvas
  FPS: 60

window.night = Night()

engine.setState Day()
engine.start()

Music.volume 0.25
Music.play "music"

