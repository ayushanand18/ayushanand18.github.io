(self.webpackChunkv1 = self.webpackChunkv1 || []).push([
  [368],
  {
    8368: function (e, t, r) {
      'use strict';
      r.r(t),
        r.d(t, {
          lazyHydrate: function () {
            return a;
          },
        });
      var o = r(9285),
        i = r(7294),
        n = r(3935);
      r(4041), r(4811);
      function a(e, t, r, a) {
        var c = e.image,
          d = e.loading,
          g = e.isLoading,
          s = e.isLoaded,
          l = e.toggleIsLoaded,
          u = e.ref,
          b = e.imgClassName,
          h = e.imgStyle,
          m = void 0 === h ? {} : h,
          f = e.objectPosition,
          j = e.backgroundColor,
          k = e.objectFit,
          v = void 0 === k ? 'cover' : k,
          y = (0, o._)(e, [
            'image',
            'loading',
            'isLoading',
            'isLoaded',
            'toggleIsLoaded',
            'ref',
            'imgClassName',
            'imgStyle',
            'objectPosition',
            'backgroundColor',
            'objectFit',
          ]),
          C = c.width,
          L = c.height,
          w = c.layout,
          p = c.images,
          N = c.placeholder,
          P = c.backgroundColor,
          E = JSON.stringify(p);
        m = (0, o.a)({ objectFit: v, objectPosition: f, backgroundColor: j }, m);
        var F = i.createElement(
          o.L,
          { layout: w, width: C, height: L },
          i.createElement(o.P, Object.assign({}, (0, o.g)(N, s, w, C, L, P, v, f))),
          i.createElement(
            o.M,
            Object.assign(
              {},
              y,
              { width: C, height: L, className: b },
              (0, o.b)(g, s, p, d, l, E, u, m),
            ),
          ),
        );
        return (
          t.current &&
            ((r.current || a.current ? n.render : n.hydrate)(F, t.current), (r.current = !0)),
          function () {
            t.current && (0, n.render)(null, t.current);
          }
        );
      }
    },
  },
]);
//# sourceMappingURL=368-a40cef50fa8067100457.js.map
