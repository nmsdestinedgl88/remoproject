/* DHF "Poured Ledger" icon kit. One source for Remotion, HyperFrames and OneTake.
   Every icon is inner SVG markup for a 120x120 box. Stand-in marks only: no real brand logos. */
(function (g) {
  var P = {
    paper: '#E9E2E9', top: '#F6F2F6', left: '#D5C9D5', right: '#B7A8B7', ink: '#333333',
    purple: '#800080', glow: '#B455B4', deep: '#5C005C', pale: '#D9B3D9', white: '#FFFFFF',
    // semantic aliases from the Manetrust scheme: charcoal = facts and costs, purple = money and the offer
    red: '#333333', green: '#800080', kraft: '#D9B3D9'
  };
  var SW = 5; // outline weight
  var st = 'stroke="' + P.ink + '" stroke-width="' + SW + '" stroke-linejoin="round" stroke-linecap="round"';

  function person(fill, hat) {
    return '<circle cx="60" cy="30" r="15" fill="' + fill + '" ' + st + '/>' +
      '<path d="M32 110 V76 Q32 50 60 50 Q88 50 88 76 V110 H66 V88 H54 V110 Z" fill="' + fill + '" ' + st + '/>' +
      (hat ? '<path d="M42 26 Q42 8 60 8 Q78 8 78 26 Z" fill="' + hat + '" ' + st + '/><rect x="38" y="24" width="44" height="7" rx="3" fill="' + hat + '" ' + st + '/>' : '');
  }

  var ICONS = {
    P: P,
    // cement bag, front view with kraft stencil band
    bag: function () {
      return '<path d="M14 36 Q14 26 24 26 H96 Q106 26 106 36 V92 Q106 102 96 102 H24 Q14 102 14 92 Z" fill="' + P.top + '" ' + st + '/>' +
        '<path d="M14 36 Q14 26 24 26 H96 Q106 26 106 36 V44 H14 Z" fill="' + P.left + '" ' + st + '/>' +
        '<rect x="14" y="56" width="92" height="26" fill="' + P.purple + '" ' + st + '/>' +
        '<path d="M34 76 L40 62 L46 76 M37 71 H43" fill="none" stroke="' + P.paper + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="56" y="64" width="36" height="5" fill="' + P.paper + '"/><rect x="56" y="73" width="24" height="5" fill="' + P.paper + '"/>';
    },
    bank: function (fill) {
      fill = fill || P.top;
      return '<polygon points="10,44 60,12 110,44" fill="' + fill + '" ' + st + '/>' +
        [20, 42, 64, 86].map(function (x) { return '<rect x="' + x + '" y="52" width="14" height="38" fill="' + P.paper + '" ' + st + '/>'; }).join('') +
        '<rect x="10" y="90" width="100" height="10" fill="' + fill + '" ' + st + '/><rect x="4" y="100" width="112" height="10" fill="' + fill + '" ' + st + '/>' +
        '<circle cx="60" cy="34" r="6" fill="' + P.ink + '"/>';
    },
    house: function (roof, door) {
      return '<rect x="18" y="52" width="84" height="56" fill="' + P.left + '" ' + st + '/>' +
        '<polygon points="8,56 60,12 112,56" fill="' + (roof || P.ink) + '" ' + st + '/>' +
        '<rect x="50" y="74" width="22" height="34" fill="' + (door || P.purple) + '" ' + st + '/>' +
        '<rect x="26" y="66" width="16" height="16" fill="' + P.paper + '" ' + st + '/><rect x="80" y="66" width="16" height="16" fill="' + P.paper + '" ' + st + '/>';
    },
    family: function () {
      return '<g transform="translate(-12 10) scale(.72)">' + person(P.ink) + '</g>' +
        '<g transform="translate(34 10) scale(.72)">' + person(P.ink) + '</g>' +
        '<g transform="translate(76 54) scale(.46)">' + person(P.ink) + '</g>';
    },
    person: function (fill) { return person(fill || P.ink); },
    contractor: function () {
      return person(P.ink, P.purple) +
        '<rect x="86" y="56" width="10" height="46" rx="3" fill="' + P.pale + '" ' + st + ' transform="rotate(28 91 79)"/>' +
        '<rect x="74" y="42" width="30" height="14" rx="3" fill="' + P.right + '" ' + st + ' transform="rotate(28 89 49)"/>';
    },
    coin: function (fill) {
      return '<ellipse cx="60" cy="62" rx="46" ry="46" fill="' + (fill || P.purple) + '" ' + st + '/>' +
        '<ellipse cx="60" cy="62" rx="32" ry="32" fill="none" stroke="' + P.paper + '" stroke-width="3"/>' +
        '<path d="M48 78 V46 L72 78 V46 M44 56 H76 M44 68 H76" fill="none" stroke="' + P.paper + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
    },
    shield: function () {
      return '<path d="M60 8 L108 24 V62 Q108 98 60 114 Q12 98 12 62 V24 Z" fill="' + P.purple + '" ' + st + '/>' +
        '<path d="M60 20 L96 32 V62 Q96 90 60 103 Q24 90 24 62 V32 Z" fill="none" stroke="' + P.paper + '" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<polygon points="38,66 60,44 82,66" fill="' + P.paper + '"/><rect x="45" y="66" width="30" height="22" fill="' + P.paper + '"/><rect x="55" y="72" width="10" height="16" fill="' + P.purple + '"/>';
    },
    key: function () {
      return '<circle cx="36" cy="60" r="24" fill="' + P.kraft + '" ' + st + '/><circle cx="36" cy="60" r="8" fill="' + P.paper + '" ' + st + '/>' +
        '<path d="M58 60 H112 M96 60 V78 M84 60 V74" fill="none" ' + st + ' stroke-width="9"/>';
    },
    lock: function (fill) {
      return '<path d="M38 52 V38 Q38 14 60 14 Q82 14 82 38 V52" fill="none" ' + st + ' stroke-width="9"/>' +
        '<rect x="24" y="50" width="72" height="56" rx="8" fill="' + (fill || P.ink) + '" ' + st + '/>' +
        '<circle cx="60" cy="74" r="7" fill="' + P.paper + '"/><rect x="57" y="76" width="6" height="16" fill="' + P.paper + '"/>';
    },
    truck: function () {
      return '<rect x="6" y="30" width="70" height="52" fill="' + P.top + '" ' + st + '/>' +
        '<rect x="6" y="30" width="70" height="14" fill="' + P.purple + '" ' + st + '/>' +
        '<path d="M76 46 H98 L112 64 V82 H76 Z" fill="' + P.left + '" ' + st + '/><path d="M84 52 H96 L104 64 H84 Z" fill="' + P.paper + '" ' + st + '/>' +
        '<circle cx="30" cy="88" r="13" fill="' + P.ink + '"/><circle cx="92" cy="88" r="13" fill="' + P.ink + '"/>' +
        '<circle cx="30" cy="88" r="5" fill="' + P.paper + '"/><circle cx="92" cy="88" r="5" fill="' + P.paper + '"/>';
    },
    fund: function () { // DHF fund: vault block
      return '<rect x="12" y="24" width="96" height="76" rx="8" fill="' + P.purple + '" ' + st + '/>' +
        '<circle cx="60" cy="62" r="24" fill="' + P.paper + '" ' + st + '/><circle cx="60" cy="62" r="7" fill="' + P.purple + '" ' + st + '/>' +
        '<path d="M60 40 V50 M60 74 V84 M38 62 H48 M72 62 H82" ' + st + ' stroke-width="4"/>' +
        '<rect x="24" y="100" width="14" height="10" fill="' + P.ink + '"/><rect x="82" y="100" width="14" height="10" fill="' + P.ink + '"/>';
    },
    gavel: function () {
      return '<rect x="18" y="98" width="84" height="12" rx="3" fill="' + P.left + '" ' + st + '/>' +
        '<rect x="22" y="38" width="48" height="26" rx="5" fill="' + P.kraft + '" ' + st + ' transform="rotate(-30 46 51)"/>' +
        '<rect x="52" y="52" width="14" height="52" rx="4" fill="' + P.kraft + '" ' + st + ' transform="rotate(-30 59 78)"/>';
    },
    check: function (fill) {
      return '<circle cx="60" cy="60" r="48" fill="' + (fill || P.purple) + '" ' + st + '/><path d="M34 62 L53 80 L88 42" fill="none" stroke="' + P.white + '" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>';
    },
    cross: function (fill) {
      return '<circle cx="60" cy="60" r="48" fill="' + (fill || P.ink) + '" ' + st + '/><path d="M38 38 L82 82 M82 38 L38 82" fill="none" stroke="' + P.white + '" stroke-width="11" stroke-linecap="round"/>';
    }
  };

  /** Wrap an icon as a standalone <svg> string. */
  ICONS.svg = function (name, size, a, b) {
    var inner = ICONS[name](a, b);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="' + size + '" height="' + size + '" style="overflow:visible">' + inner + '</svg>';
  };
  g.DHF_ICONS = ICONS;
  if (typeof module !== 'undefined' && module.exports) module.exports = ICONS;
})(typeof window !== 'undefined' ? window : globalThis);
