#= require_tree .

canvas = $("canvas").attr(
  width: App.width
  height: App.height
).pixieCanvas()

window.engine = Engine
  backgroundColor: Color("black")
  canvas: canvas
  FPS: 60

engine.add "Universe"

engine.add "Player",
  x: App.width/2
  y: App.height/2

engine.start()

# Music.play "seahorse"
