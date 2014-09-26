(function(colourMe) {
  // Taken from rileyjshaw's terra:
  // https://raw.githubusercontent.com/rileyjshaw/terra/master/app/dom.js
  colourMe.createCanvasElement = function(width, height, cellSize, id, insertAfter) {
    width *= cellSize;
    height *= cellSize;
    // Creates a scaled-up canvas based on the device's
    // resolution, then displays it properly using styles
    function createHDCanvas (ratio) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      // Creates a dummy canvas to test device's pixel ratio
      ratio = (function () {
        var ctx = document.createElement('canvas').getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
      })();

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.font = 'bold ' + cellSize + 'px Arial';

      if (id) canvas.id = id;

      return canvas;
    }

    var canvas = createHDCanvas();

    if (insertAfter) insertAfter.parentNode.insertBefore(canvas, insertAfter.nextSibling);
    else document.body.appendChild(canvas);

    return canvas;
  };

  // take function rgb as input, call it to determine pixels on canvas
  colourMe.animate = function(steps, rgb, canvas, cellSize, refreshPeriod) {
    var height = canvas.height / cellSize;
    var width = canvas.width / cellSize;
    var timeStep = 1 / steps;
    // Try to take refreshPeriod ms per step, accounting for time it takes to draw
    var animationTime = 0;
    function step(time) {
      return (function(timestamp) {
        var start = new Date();
        var ctx = canvas.getContext('2d');
        for (var row = 0; row < height; row++) {
          for (var col = 0; col < width; col++) {
            var rgbPx = rgb(time / refreshPeriod, row / height, col / width);
            rgbPx[0] = (rgbPx[0] & 0x100) ? 0x100 - (rgbPx[0] & 0xFF) : rgbPx[0] & 0xFF;
            rgbPx[1] = (rgbPx[1] & 0x100) ? 0x100 - (rgbPx[1] & 0xFF) : rgbPx[1] & 0xFF;
            rgbPx[2] = (rgbPx[2] & 0x100) ? 0x100 - (rgbPx[2] & 0xFF) : rgbPx[2] & 0xFF;

            ctx.fillStyle = 'rgba(' + rgbPx[0] + ',' + rgbPx[1] + ',' + rgbPx[2] + ',1)';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
        animationTime = new Date() - start;
        if (time < steps) {
          setTimeout(function() {
            requestAnimationFrame(step(time + 1));
          }, refreshPeriod - animationTime)
        }
      });
    }
    requestAnimationFrame(step(0));
  }

})(window.colourMe = window.colourMe || {}, undefined);

(function($, undefined) {
  $(document).ready(function() {
    // Expect t, x, y, on normalized intervals [0,1]
    var rgb = function(t, x, y) {
      return [256*8*t*x*y, 256*8*(t*(1-x)*(1-y)), 0];
    };

    colourMe.animate(50, rgb, colourMe.createCanvasElement(256, 256, 2, 'colourz'), 2, 50);
  });
})(jQuery);