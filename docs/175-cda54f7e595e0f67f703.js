(self.webpackChunkv1 = self.webpackChunkv1 || []).push([
  [175],
  {
    7175: function (n, e, t) {
      'use strict';
      t.r(e),
        t.d(e, {
          createIntersectionObserver: function () {
            return i;
          },
        });
      var r,
        c = new WeakMap(),
        o = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      function i(n) {
        return 'IntersectionObserver' in window
          ? (r ||
              (r = new IntersectionObserver(
                function (n) {
                  n.forEach(function (n) {
                    var e;
                    n.isIntersecting && (null == (e = c.get(n.target)) || e(), c.delete(n.target));
                  });
                },
                {
                  rootMargin:
                    '4g' !== (null == o ? void 0 : o.effectiveType) || (null != o && o.saveData)
                      ? '2500px'
                      : '1250px',
                },
              )),
            function (e) {
              return (
                e.current && (c.set(e.current, n), r.observe(e.current)),
                function () {
                  r && e.current && (c.delete(e.current), r.unobserve(e.current));
                }
              );
            })
          : function () {
              return n(), function () {};
            };
      }
    },
  },
]);
//# sourceMappingURL=175-cda54f7e595e0f67f703.js.map
