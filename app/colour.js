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
  };

  colourMe.hsl2rgb = function(H, S, L) {
    /*
     * H ∈ [0°, 360°)
     * S ∈ [0, 1]
     * L ∈ [0, 1]
     */
    H = H % 360;

    /* calculate chroma */
    var C = (1 - Math.abs((2 * L) - 1)) * S;

    /* Find a point (R1, G1, B1) along the bottom three faces of the RGB cube, with the same hue and chroma as our color (using the intermediate value X for the second largest component of this color) */
    var H_ = H / 60;

    var X = C * (1 - Math.abs((H_ % 2) - 1));

    var R1, G1, B1;

    if (H === undefined || isNaN(H) || H === null) {
        R1 = G1 = B1 = 0;
    }
    else {

        if (H_ >= 0 && H_ < 1) {
            R1 = C;
            G1 = X;
            B1 = 0;
        }
        else if (H_ >= 1 && H_ < 2) {
            R1 = X;
            G1 = C;
            B1 = 0;
        } else if (H_ >= 2 && H_ < 3) {
            R1 = 0;
            G1 = C;
            B1 = X;
        } else if (H_ >= 3 && H_ < 4) {
            R1 = 0;
            G1 = X;
            B1 = C;
        } else if (H_ >= 4 && H_ < 5) {
            R1 = X;
            G1 = 0;
            B1 = C;
        }
        else if (H_ >= 5 && H_ < 6) {
            R1 = C;
            G1 = 0;
            B1 = X;
        }
    }

    /* Find R, G, and B by adding the same amount to each component, to match lightness */

    var m = L - (C / 2);

    var R, G, B;

    /* Normalise to range [0,255] by multiplying 255 */
    R = (R1 + m) * 255;
    G = (G1 + m) * 255;
    B = (B1 + m) * 255;

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    return [R, G, B];
  };

})(window.colourMe = window.colourMe || {}, undefined);

var exec = function(code) {
  eval(code);
};

(function($, undefined) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setOptions({maxLines: 50, minLines: 10})
  var canvas = colourMe.createCanvasElement(256, 256, 2, 'colourz', document.getElementById("header"));

  $(document).ready(function() {
    var go = function() {
      exec(editor.getValue());
    };
    go();
    $("#editor-submit").on("click", go);
  });
})(jQuery);


