var App;

App = {
  width: 800,
  height: 450
};
var Day;

Day = function(I) {
  var self;

  if (I == null) {
    I = {};
  }
  self = GameState(I);
  self.on("enter", function() {
    engine.fadeIn();
    engine.add("Universe");
    return engine.add("Player", {
      x: App.width / 2,
      y: App.height / 2
    });
  });
  return self;
};
var Message;

Message = function(I) {
  var self;

  if (I == null) {
    I = {};
  }
  Object.reverseMerge(I, {
    color: "black",
    font: "18px Helvetica",
    text: "Meaning is the relationship",
    textShadow: "transparent",
    zIndex: 1000
  });
  self = TextEffect(I);
  return self;
};
var Night;

Night = function(I) {
  var self;

  if (I == null) {
    I = {};
  }
  Object.reverseMerge(I, {
    seedPouch: []
  });
  self = GameState(I);
  self.on("enter", function() {
    engine.fadeIn();
    engine.add("NightPlayer", {
      seedPouch: I.seedPouch
    });
    engine.add("Message", {
      text: "lost",
      x: App.width / 2,
      y: App.height / 2
    });
    engine.add("Message", {
      text: "found",
      x: App.width - 80,
      y: 170
    });
    ["please", "see clearly"].each(function(message, i) {
      return engine.add("Message", {
        text: message,
        x: App.width - 180,
        y: 90 - i * 20
      });
    });
    ["All progress", "arrives after", "total surrender."].each(function(message, i) {
      return engine.add("Message", {
        text: message,
        x: App.width - 400 + i * 50,
        y: App.height - 50 - i * 30
      });
    });
    return ["Meaning is the relationship", "between context and events."].each(function(message, i) {
      return engine.add("Message", {
        text: message,
        x: 150 + i * 50,
        y: 200 + i * 40
      });
    });
  });
  return self;
};
var NightPlayer;

NightPlayer = function(I) {
  var addSeed, returnToTheLight, self;

  if (I == null) {
    I = {};
  }
  Object.defaults(I, {
    seedPouch: [],
    zIndex: 10
  });
  self = GameObject(I).extend({
    draw: function() {}
  });
  addSeed = function(position, seed) {
    return engine.add("Seed", {
      color: Seed.Colors.first(),
      radius: seed,
      x: position.x,
      y: position.y
    });
  };
  returnToTheLight = (function() {
    engine.delay(3, function() {
      return engine.setState(Day());
    });
    return engine.delay(2.5, function() {
      return engine.fadeOut();
    });
  }).once();
  self.on("update", function() {
    var position, seed;

    position = mousePosition;
    if (mousePressed.left) {
      if (seed = I.seedPouch.shift()) {
        addSeed(position, seed);
      }
    }
    if (I.seedPouch.length === 0) {
      return returnToTheLight();
    }
  });
  self.on("overlay", function(canvas) {
    canvas.drawRoundRect({
      x: App.width - 50,
      y: 5,
      width: 40,
      height: App.height - 10,
      color: "rgba(128, 128, 128, 0.5)"
    });
    return I.seedPouch.each(function(seed, i) {
      var r, radius, x, y;

      if (i === 0) {
        r = Math.sin(I.age / 2 * Math.TAU) * 3 + 3;
      } else {
        r = 0;
      }
      radius = (Math.log(seed) * 3 + r).clamp(5, 15);
      x = App.width - 30;
      y = (i + 1) * 30;
      return canvas.withTransform(Matrix.translation(x, y), function(canvas) {
        return canvas.drawCircle({
          color: Seed.gradient(radius, Seed.Colors.first(), canvas.context()),
          radius: radius,
          x: 0,
          y: 0
        });
      });
    });
  });
  return self;
};
var Pickup;

Pickup = function(I) {
  var self;

  if (I == null) {
    I = {};
  }
  self = GameObject(I).extend({
    gain: function() {
      return self.destroy();
    }
  });
  self.on("update", function(elapsedTime) {
    return I.color = ["white", "black"].wrap((I.age / 0.25).floor());
  });
  return self;
};
var Player;

Player = function(I) {
  var addSeed, canPlaceSeed, inUniverse, seeds, self;

  if (I == null) {
    I = {};
  }
  seeds = [Seed.Primaries[0], Seed.Primaries[2], Seed.Primaries[0], Seed.Primaries[2], Seed.Primaries[1]];
  Object.defaults(I, {
    zIndex: 10
  });
  self = GameObject(I).extend({
    draw: function() {},
    gainSeed: function() {
      return seeds.push(Seed.Primaries.rand());
    }
  });
  5..times(function() {
    return self.gainSeed();
  });
  inUniverse = function(position) {
    var universe;

    if (universe = engine.first("Universe")) {
      return position.distance(universe.position()) < universe.radius();
    }
  };
  canPlaceSeed = function(position) {
    return engine.find("Seed").inject(true, function(free, seed) {
      return free && !(position.distance(seed.position()) < seed.radius());
    });
  };
  addSeed = function(position, seed) {
    return engine.add("Seed", {
      color: seed,
      x: position.x,
      y: position.y
    });
  };
  self.on("update", function() {
    var position, seed;

    position = mousePosition;
    if (mousePressed.left) {
      if (canPlaceSeed(position)) {
        if (seed = seeds.shift()) {
          addSeed(position, seed);
        }
      }
    }
    return engine.find("Pickup").each(function(pickup) {
      if (position.distance(pickup.position()) < 10) {
        pickup.gain();
        return self.gainSeed();
      }
    });
  });
  self.on("overlay", function(canvas) {
    canvas.drawRoundRect({
      x: App.width - 50,
      y: 5,
      width: 40,
      height: App.height - 10,
      color: "rgba(128, 128, 128, 0.5)"
    });
    return seeds.each(function(seed, i) {
      var r, radius, x, y;

      if (i === 0) {
        r = Math.sin(I.age / 2 * Math.TAU) * 3 + 3;
      } else {
        r = 0;
      }
      radius = 10 + r;
      x = App.width - 30;
      y = (i + 1) * 30;
      return canvas.withTransform(Matrix.translation(x, y), function(canvas) {
        return canvas.drawCircle({
          color: Seed.gradient(radius, seed, canvas.context()),
          radius: radius,
          x: 0,
          y: 0
        });
      });
    });
  });
  return self;
};
var Seed;

Seed = function(I) {
  var addPickup, antagonism, darknessSpreads, fireHealsAll, friendsOrFoes, genTime, illuminate, lightTheNight, merge, seedCollide, self;

  if (I == null) {
    I = {};
  }
  genTime = 5;
  Object.reverseMerge(I, {
    radius: 10,
    color: Seed.Colors.rand(),
    timer: genTime,
    lightness: false
  });
  I.n = Seed.Colors.indexOf(I.color);
  self = GameObject(I).extend({
    colorNum: function() {
      return I.n;
    },
    compatible: function(other) {
      return !(self.colorNum() & other.colorNum());
    },
    collisionFn: function(n, m) {
      if (n === 0 || m === 0) {
        return lightTheNight;
      } else if (n === 7 || m === 7) {
        if (n === m) {
          return function() {};
        } else {
          return darknessSpreads;
        }
      } else if (n === 3 || m === 3) {
        if (n & m) {
          return fireHealsAll;
        } else {
          return friendsOrFoes;
        }
      } else if (n === 2 && m === 2) {
        return merge;
      } else {
        return friendsOrFoes;
      }
    }
  });
  seedCollide = function(fn) {
    return Collision.collide("Seed", self, function(other, self) {
      if (other !== self) {
        return fn(other, self);
      }
    }, function(a, b) {
      return Collision.circular(a.circle(), b.circle());
    });
  };
  illuminate = function(seed) {
    if (seed.colorNum() === 7) {
      return seed.destroy();
    }
  };
  lightTheNight = function(other, self) {
    illuminate(other);
    return illuminate(self);
  };
  fireHealsAll = function(other, self) {
    if (other.I.radius + self.I.radius > 100) {
      other.I.n = 0;
      self.I.n = 0;
      other.I.color = Seed.Colors.first();
      self.I.color = Seed.Colors.first();
    }
    return merge(other, self);
  };
  friendsOrFoes = function(other, self) {
    if (self.compatible(other)) {
      return merge(other, self);
    } else {
      return antagonism(other, self);
    }
  };
  merge = function(other, self) {
    var n, p, x, y;

    self.destroy();
    other.destroy();
    x = self.colorNum();
    y = other.colorNum();
    if (self.radius() > other.radius()) {
      p = self.position();
    } else {
      p = other.position();
    }
    n = x | y;
    return engine.add("Seed", {
      color: Seed.Colors[n],
      x: p.x,
      y: p.y,
      lightness: n === 0,
      radius: I.radius + other.I.radius
    });
  };
  antagonism = function(other, self) {
    self.I.radius -= 10;
    return other.I.radius -= 10;
  };
  addPickup = function() {
    var p;

    p = Point.random().scale(50);
    return engine.add("Pickup", {
      x: I.x + p.x,
      y: I.y + p.y
    });
  };
  darknessSpreads = function(other, self) {
    other.I.n = 7;
    return other.I.color = Seed.Colors.last();
  };
  self.on("update", function(elapsedTime) {
    var n, universe, _ref;

    if (!I.active) {
      return;
    }
    n = self.colorNum();
    switch (n) {
      case 0:
        if (universe = engine.first("Universe")) {
          I.radius -= 3 * elapsedTime;
          universe.expand(3 * elapsedTime);
        } else {

        }
        break;
      case 1:
        I.radius += 10 * elapsedTime;
        if (I.radius >= 100) {
          engine.camera().shake();
          3..times(addPickup);
          self.destroy();
        }
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        I.radius += 2 * elapsedTime;
        break;
      case 5:
        break;
      case 6:
        I.timer -= elapsedTime;
        if (I.timer <= 0) {
          I.timer = genTime;
          addPickup();
        }
        I.radius -= 2 * elapsedTime;
        break;
      case 7:
        if ((_ref = engine.first("Universe")) != null) {
          _ref.expand(-elapsedTime);
        }
        I.radius -= elapsedTime;
    }
    return seedCollide(function(other, self) {
      return self.collisionFn(other.colorNum(), self.colorNum())(other, self);
    });
  });
  self.on("afterUpdate", function() {
    I.radius = I.radius.clamp(0, Infinity);
    if (I.radius <= 5) {
      return self.destroy();
    }
  });
  self.unbind("draw");
  self.on("draw", function(canvas) {
    if (I.n === 0) {
      I.alpha = Math.sin(I.age * Math.TAU).clamp(0.01, 0.5);
      I.color = Color(255, 255, 215, 0);
      I.zIndex = 500;
    }
    return canvas.drawCircle({
      x: 0,
      y: 0,
      radius: I.radius,
      color: Seed.gradient(I.radius, I.color, canvas.context())
    });
  });
  self.attrReader("radius");
  return self;
};

Seed.ColorNums = [0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7];

Seed.Colors = ["white", "red", [224, 224, 0], "orange", "blue", "purple", "green", "black"].map(function(name) {
  if (typeof name.isString === "function" ? name.isString() : void 0) {
    return Color(name);
  } else {
    return Color.apply(null, name);
  }
});

Seed.Primaries = [Seed.Colors[1], Seed.Colors[2], Seed.Colors[4]];

Seed.gradient = function(radius, color, context) {
  var a, b, b1, edgeAlpha, g, g1, r, r1, radgrad, t, _ref, _ref1, _ref2, _ref3;

  t = radius / 3;
  radgrad = context.createRadialGradient(-t, -t, 0, 0, 0, radius);
  a = 0.75;
  edgeAlpha = 1;
  _ref = color.channels(), r = _ref[0], g = _ref[1], b = _ref[2];
  radgrad.addColorStop(0, "rgba(255, 255, 255, " + a + ")");
  _ref1 = [r, g, b].map(function(n) {
    return (n * 11 / 7).clamp(0, 255).floor();
  }), r1 = _ref1[0], g1 = _ref1[1], b1 = _ref1[2];
  radgrad.addColorStop(0.5, "rgba(" + r1 + ", " + g1 + ", " + b1 + ", " + a + ")");
  _ref2 = [r, g, b].map(function(n) {
    return (n * 7 / 8).floor();
  }), r = _ref2[0], g = _ref2[1], b = _ref2[2];
  radgrad.addColorStop(0.9, "rgba(" + r + ", " + g + ", " + b + ", " + a + ")");
  _ref3 = [r, g, b].map(function(n) {
    return (n * 7 / 8).floor();
  }), r = _ref3[0], g = _ref3[1], b = _ref3[2];
  radgrad.addColorStop(1, "rgba(" + r + ", " + g + ", " + b + ", " + edgeAlpha + ")");
  return radgrad;
};
var Universe;

Universe = function(I) {
  var gatherSeeds, self;

  if (I == null) {
    I = {};
  }
  Object.reverseMerge(I, {
    color: "white",
    radius: App.width / 2 + 60,
    x: App.width / 2,
    y: App.height / 2,
    zIndex: -100
  });
  self = GameObject(I).extend({
    expand: function(n) {
      return I.radius += n * (1 + (I.age / 30).floor());
    }
  });
  self.attrReader("radius");
  self.on("update", function(elapsedTime) {
    var noneLeft, rate;

    if (I.age < 120) {
      rate = 2;
    } else if (I.age < 180) {
      rate = 3;
    } else if (I.age < 240) {
      rate = 6;
    } else if (I.age < 300) {
      rate = 9;
    } else {
      rate = 12;
    }
    self.expand(-rate * elapsedTime);
    noneLeft = !engine.find("Seed").inject(false, function(anyLegit, seed) {
      return anyLegit || seed.colorNum() !== 7;
    });
    if (noneLeft && I.age > 30) {
      self.expand(-4 * elapsedTime);
    }
    return engine.find("Seed").each(function(seed) {
      var delta, n;

      n = seed.colorNum();
      if (n === 7 || n === 0 || n === 5) {
        return;
      }
      delta = self.position().subtract(seed.position());
      return seed.I.radius = seed.I.radius.clamp(0, I.radius - delta.length());
    });
  });
  gatherSeeds = function() {
    return engine.find("Seed").map(function(seed) {
      var radius;

      return radius = seed.radius();
    });
  };
  self.on("afterUpdate", function() {
    if (I.radius <= 0) {
      I.radius = 0;
      night.I.seedPouch = gatherSeeds();
      engine.setState(night);
    }
    if (justPressed.f1) {
      night.I.seedPouch = gatherSeeds();
      return engine.setState(night);
    }
  });
  return self;
};
var canvas;

canvas = $("canvas").attr({
  width: App.width,
  height: App.height
}).pixieCanvas();

window.engine = Engine({
  backgroundColor: Color("black"),
  canvas: canvas,
  FPS: 60
});

window.night = Night();

engine.setState(Day());

engine.start();
