(self.webpackChunkv1 = self.webpackChunkv1 || []).push([
  [883],
  {
    9616: function (e, t, n) {
      'use strict';
      n.r(t);
      var i = n(7294),
        o = n(5444),
        l = n(5414),
        a = n(8589),
        c = n(6979),
        r = n(9),
        m = n(4165),
        u = n(4741),
        s = n(3082),
        f = r.ZP.main.withConfig({
          displayName: 'sc-404__StyledMainContainer',
          componentId: 'sc-gwhibq-0',
        })(['', ';flex-direction:column;'], function (e) {
          return e.theme.mixins.flexCenter;
        }),
        p = r.ZP.h1.withConfig({ displayName: 'sc-404__StyledTitle', componentId: 'sc-gwhibq-1' })([
          'color:var(--green);font-family:var(--font-mono);font-size:clamp(100px,25vw,200px);line-height:1;',
        ]),
        h = r.ZP.h2.withConfig({
          displayName: 'sc-404__StyledSubtitle',
          componentId: 'sc-gwhibq-2',
        })(['font-size:clamp(30px,5vw,50px);font-weight:400;']),
        d = (0, r.ZP)(o.Link).withConfig({
          displayName: 'sc-404__StyledHomeButton',
          componentId: 'sc-gwhibq-3',
        })(['', ';margin-top:40px;'], function (e) {
          return e.theme.mixins.bigButton;
        });
      t.default = function (e) {
        var t = e.location,
          n = (0, i.useState)(!1),
          o = n[0],
          r = n[1],
          g = (0, s.Tb)();
        (0, i.useEffect)(function () {
          if (!g) {
            var e = setTimeout(function () {
              return r(!0);
            }, m.fb);
            return function () {
              return clearTimeout(e);
            };
          }
        }, []);
        var w = i.createElement(
          f,
          { className: 'fillHeight' },
          i.createElement(p, null, '404'),
          i.createElement(h, null, 'Page Not Found'),
          i.createElement(d, { to: '/' }, 'Go Home'),
        );
        return i.createElement(
          u.Ar,
          { location: t },
          i.createElement(l.q, { title: 'Page Not Found' }),
          g
            ? i.createElement(i.Fragment, null, w)
            : i.createElement(
                a.Z,
                { component: null },
                o && i.createElement(c.Z, { timeout: 500, classNames: 'fadeup' }, w),
              ),
        );
      };
    },
  },
]);
//# sourceMappingURL=component---src-pages-404-js-23fa4337e463649446b3.js.map