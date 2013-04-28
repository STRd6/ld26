Message = (I={}) ->
  Object.reverseMerge I,
    color: "black"
    font: "18px Helvetica"
    text: "Meaning is the relationship"
    textShadow: "transparent"
    zIndex: 1000

  self = TextEffect(I)

  return self
