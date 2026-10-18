// Future of Work · 4 Shifts — content from the back-office spreadsheet.
// The model in index.html (and its French translation in i18n.js) is the built-in version.
// At load, /api/content gives the version of the spreadsheet in the page language. Each part
// (shifts, levels, challenges, questions, initiatives, rules) replaces the built-in part only
// if it passes the checks below. Otherwise the built-in part stays, and a warning goes to the console.
// The app starts when the answer arrives, or after 2.5 seconds at most.
(function () {
  'use strict';
  var F = window.FOW;
  var SIDS = Object.keys(F.shifts);
  var CIDS = Object.keys(F.challenges);
  var QIDS = F.questions.map(function (q) { return q.id; });
  var str = function (v) { return typeof v === 'string' && v.trim() !== ''; };
  var sameSet = function (a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); };
  var warn = function (part, why) { try { console.warn('[content] ' + part + ' from the spreadsheet not used: ' + why); } catch (e) {} };

  // A rule condition such as "q21 >= 3 && q33 <= 2". Allowed: qNN, numbers, comparisons, && || ( ),
  // and the words ET, OU, AND, OR. A single = means "equal".
  function compile(cond) {
    var s = String(cond || '').replace(/\b(ET|AND)\b/gi, '&&').replace(/\b(OU|OR)\b/gi, '||');
    if (!str(s) || !/^[\sq0-9<>=!&|()]+$/.test(s)) return null;
    var refs = s.match(/q\d\d/g) || [];
    if (!refs.length || refs.some(function (q) { return QIDS.indexOf(q) < 0; })) return null;
    s = s.replace(/(^|[^<>=!])=(?!=)/g, '$1===').replace(/<>/g, '!==').replace(/\b(q\d\d)\b/g, 'a.$1');
    try {
      var fn = new Function('a', '"use strict"; return (' + s + ');');
      var test = {}; QIDS.forEach(function (q) { test[q] = 2; });
      if (typeof fn(test) !== 'boolean') return null;
      return fn;
    } catch (e) { return null; }
  }

  function hasCycle(items) {
    var by = {}; items.forEach(function (i) { by[i.id] = i; });
    var state = {};
    function visit(id) {
      if (state[id] === 1) return true; if (state[id] === 2) return false;
      state[id] = 1;
      var bad = (by[id].req || []).some(visit);
      state[id] = 2; return bad;
    }
    return items.some(function (i) { return visit(i.id); });
  }

  var checks = {
    shifts: function (m) {
      var v = m.shifts;
      if (!v || !sameSet(Object.keys(v), SIDS)) return 'the shift ids must stay ' + SIDS.join(', ');
      if (SIDS.some(function (s) { return !str(v[s].n) || !str(v[s].full); })) return 'a shift has no name';
      SIDS.forEach(function (s) { Object.assign(F.shifts[s], { n: v[s].n, full: v[s].full }, str(v[s].line) ? { line: v[s].line } : {}); });
    },
    levels: function (m) {
      if (!Array.isArray(m.levels) || m.levels.length !== 4 || !m.levels.every(str)) return 'there must be 4 named levels';
      F.levels = m.levels; if (str(m.levelNote)) F.levelNote = m.levelNote;
    },
    challenges: function (m) {
      var v = m.challenges;
      if (!v || !sameSet(Object.keys(v), CIDS)) return 'the challenge ids must stay the same 16';
      if (CIDS.some(function (c) { return (v[c].g !== 'P' && v[c].g !== 'C') || !str(v[c].n) || !str(v[c].d); })) return 'a challenge has no group (P or C), name or description';
      CIDS.forEach(function (c) { Object.assign(F.challenges[c], { g: v[c].g, n: v[c].n, d: v[c].d }, str(v[c].ex) ? { ex: v[c].ex } : {}); });
    },
    questions: function (m) {
      var v = m.questions;
      if (!Array.isArray(v) || !sameSet(v.map(function (q) { return q.id; }), QIDS)) return 'the question ids must stay ' + QIDS.join(', ');
      for (var k = 0; k < v.length; k++) {
        var q = v[k];
        if (SIDS.indexOf(q.s) < 0) return q.id + ': unknown shift';
        if (!Array.isArray(q.ch) || !q.ch.length || q.ch.some(function (c) { return CIDS.indexOf(c) < 0; })) return q.id + ': unknown challenge';
        if (!str(q.q) || !str(q.t) || !Array.isArray(q.o) || q.o.length !== 4 || !q.o.every(str)) return q.id + ': a text is empty';
      }
      var by = {}; v.forEach(function (q) { by[q.id] = q; });
      F.questions.forEach(function (q) { var n = by[q.id]; Object.assign(q, { s: n.s, ch: n.ch, t: n.t, topic: str(n.topic) ? n.topic : n.t, q: n.q, o: n.o }); });
    },
    initiatives: function (m) {
      var v = m.initiatives;
      if (!Array.isArray(v) || !v.length) return 'no initiative';
      var ids = v.map(function (i) { return i.id; });
      for (var k = 0; k < v.length; k++) {
        var i = v[k];
        if (!str(i.id) || ids.indexOf(i.id) !== k) return 'empty or repeated id ' + i.id;
        if (QIDS.indexOf(i.q) < 0) return i.id + ': unknown question';
        if (i.step !== 'a' && i.step !== 'b') return i.id + ': step must be a or b';
        if (SIDS.indexOf(i.s) < 0) return i.id + ': unknown shift';
        if (!(i.year >= 2027 && i.year <= 2030 && i.year % 1 === 0)) return i.id + ': year must be 2027 to 2030';
        if ((i.req || []).some(function (r) { return ids.indexOf(r) < 0 || r === i.id; })) return i.id + ': unknown prerequisite';
        if (!str(i.n) || !str(i.d)) return i.id + ': a text is empty';
      }
      if (hasCycle(v)) return 'prerequisites go round in a circle';
      F.initiatives = v.map(function (i) { var x = { id: i.id, q: i.q, step: i.step, s: i.s, year: i.year, n: i.n, d: i.d }; if (i.req && i.req.length) x.req = i.req; return x; });
    },
    rules: function (m) {
      var v = m.rules;
      if (!Array.isArray(v)) return 'no rule list';
      var out = [];
      for (var k = 0; k < v.length; k++) {
        var r = v[k], fn = compile(r.cond);
        if (!fn) return (r.id || 'rule ' + (k + 1)) + ': condition not understood';
        if (!Array.isArray(r.ch) || !r.ch.length || r.ch.some(function (c) { return CIDS.indexOf(c) < 0; })) return r.id + ': unknown challenge';
        if (!str(r.t) || !str(r.d) || !str(r.fix)) return r.id + ': a text is empty';
        var x = { when: fn, t: r.t, d: r.d, fix: r.fix, ch: r.ch }; if (r.kind === 'limit') x.kind = 'limit';
        out.push(x);
      }
      F.rules = out;
    },
    profile: function (m) {
      var v = m.profile, ids = (F.profile || []).map(function (f) { return f.id; });
      if (!Array.isArray(v) || !sameSet(v.map(function (f) { return f.id; }), ids)) return 'the profile fields must stay ' + ids.join(', ');
      for (var k = 0; k < v.length; k++) {
        var f = v[k], seen = {};
        if (!str(f.q) || !Array.isArray(f.o) || f.o.length < 2) return f.id + ': a question and at least 2 options are needed';
        for (var j = 0; j < f.o.length; j++) {
          var o = f.o[j];
          if (!/^[a-z0-9]{1,20}$/.test(o[0]) || seen[o[0]] || !str(o[1])) return f.id + ': option ids must be short, unique, in lower case, with a label';
          seen[o[0]] = 1;
        }
      }
      F.profile = ids.map(function (id) { var f = v.filter(function (x) { return x.id === id; })[0]; return { id: id, q: f.q, o: f.o.map(function (o) { return [o[0], o[1]]; }) }; });
    }
  };

  function apply(m) {
    if (!m || m.lang !== window.LANG) return false;
    var used = 0;
    Object.keys(checks).forEach(function (part) {
      var why; try { why = checks[part](m); } catch (e) { why = String(e); }
      if (why) warn(part, why); else used++;
    });
    return used > 0;
  }

  window.FOW_SOURCE = 'built-in';
  window.FOW_START = function (run) {
    var started = false;
    var go = function () { if (started) return; started = true; run(); };
    var timer = setTimeout(go, 2500);
    var done = function () { clearTimeout(timer); go(); };
    try {
      fetch('/api/content?lang=' + window.LANG, { headers: { accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (m) { if (!started && apply(m)) window.FOW_SOURCE = 'spreadsheet'; })
        .catch(function () {})
        .then(done);
    } catch (e) { done(); }
  };
})();
