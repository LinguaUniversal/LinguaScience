/* =========================================================
   Science 6 — interactive engine
   Quiz · True/False · Fill-in · Leitner CLIL flashcards
   ========================================================= */

(function() {
  'use strict';

  /* ---------- helpers ---------- */
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function readJsonScript(container) {
    var node = container.querySelector('script[type="application/json"]');
    if (!node) return null;
    try { return JSON.parse(node.textContent); }
    catch (e) { console.error('JSON parse error in', container, e); return null; }
  }
  function normalize(s) {
    return String(s).toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }
  function toLetter(i) { return String.fromCharCode(65 + i); }

  /* =========================================================
     QUIZ (multiple choice, single answer)
     - data: [{q, options[], answer (index), explain}]
     ========================================================= */
  function initQuiz(container) {
    var data = readJsonScript(container);
    if (!data) return;
    var title = container.dataset.quizTitle || '';

    var html = '<div class="quiz">';
    if (title) html += '<h3 class="quiz-title-h">' + escapeHtml(title) + '</h3>';
    data.forEach(function(item, i) {
      html += '<div class="quiz-q" data-q="' + i + '">';
      html += '<div class="quiz-text"><span class="num">' + (i+1) + '.</span>' + escapeHtml(item.q) + '</div>';
      html += '<div class="quiz-options">';
      item.options.forEach(function(opt, j) {
        html += '<button class="quiz-opt" data-i="' + j + '" type="button">'
             + '<span class="letter">' + toLetter(j) + '</span>'
             + '<span class="text">' + escapeHtml(opt) + '</span>'
             + '</button>';
      });
      html += '</div>';
      if (item.explain) html += '<div class="quiz-explain"></div>';
      html += '</div>';
    });
    html += '<div class="quiz-result">';
    html += '<div class="score-label">Tvůj výsledek</div>';
    html += '<div class="score">0 / ' + data.length + '</div>';
    html += '<button class="reset" type="button">Zkusit znovu</button>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
    var answered = 0;
    var correct = 0;
    var quizEl = container.querySelector('.quiz');

    container.querySelectorAll('.quiz-q').forEach(function(qEl, idx) {
      var item = data[idx];
      qEl.querySelectorAll('.quiz-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (qEl.dataset.done === '1') return;
          qEl.dataset.done = '1';
          var picked = parseInt(btn.dataset.i, 10);
          qEl.querySelectorAll('.quiz-opt').forEach(function(b) {
            b.disabled = true;
            var bi = parseInt(b.dataset.i, 10);
            if (bi === item.answer) b.classList.add('is-correct');
            else if (bi === picked) b.classList.add('is-wrong');
          });
          if (item.explain) {
            var ex = qEl.querySelector('.quiz-explain');
            ex.textContent = item.explain;
            ex.classList.add('is-shown');
          }
          if (picked === item.answer) correct++;
          answered++;
          if (answered === data.length) showResult();
        });
      });
    });

    function showResult() {
      var res = quizEl.querySelector('.quiz-result');
      res.querySelector('.score').textContent = correct + ' / ' + data.length;
      res.classList.add('is-shown');
      res.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
    quizEl.querySelector('.reset').addEventListener('click', function() {
      initQuiz(container);
    });
  }

  /* =========================================================
     TRUE / FALSE
     - data: [{text, answer (true|false), explain?}]
     ========================================================= */
  function initTrueFalse(container) {
    var data = readJsonScript(container);
    if (!data) return;
    var html = '<div class="quiz">';
    data.forEach(function(item, i) {
      html += '<div class="tf-q" data-q="' + i + '">';
      html += '<div class="text"><span class="num">' + (i+1) + '.</span>' + escapeHtml(item.text) + '</div>';
      html += '<div class="tf-buttons">';
      html += '<button class="tf-btn" data-v="true" type="button" title="Pravda">P</button>';
      html += '<button class="tf-btn" data-v="false" type="button" title="Nepravda">N</button>';
      html += '</div></div>';
    });
    html += '<div class="quiz-result">';
    html += '<div class="score-label">Tvůj výsledek</div>';
    html += '<div class="score">0 / ' + data.length + '</div>';
    html += '<button class="reset" type="button">Zkusit znovu</button>';
    html += '</div></div>';
    container.innerHTML = html;

    var answered = 0, correct = 0;
    var quizEl = container.querySelector('.quiz');
    container.querySelectorAll('.tf-q').forEach(function(qEl, idx) {
      var item = data[idx];
      qEl.querySelectorAll('.tf-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (qEl.dataset.done === '1') return;
          qEl.dataset.done = '1';
          var picked = btn.dataset.v === 'true';
          qEl.querySelectorAll('.tf-btn').forEach(function(b) {
            b.disabled = true;
            var bv = b.dataset.v === 'true';
            if (bv === item.answer) b.classList.add('is-correct');
            else if (bv === picked) b.classList.add('is-wrong');
          });
          if (picked === item.answer) correct++;
          answered++;
          if (answered === data.length) {
            var res = quizEl.querySelector('.quiz-result');
            res.querySelector('.score').textContent = correct + ' / ' + data.length;
            res.classList.add('is-shown');
          }
        });
      });
    });
    quizEl.querySelector('.reset').addEventListener('click', function() {
      initTrueFalse(container);
    });
  }

  /* =========================================================
     FILL-IN (gap fill)
     - data: [{text: "Před {{}} lety …", answers: ["13,8 mld|13.8 mld"]}]
     ========================================================= */
  function initFill(container) {
    var data = readJsonScript(container);
    if (!data) return;
    var html = '<div class="quiz">';
    data.forEach(function(item, i) {
      var parts = item.text.split('___');
      var line = '<div class="fill-q" data-q="' + i + '"><span class="fill-num">' + (i+1) + '.</span>';
      parts.forEach(function(p, j) {
        line += escapeHtml(p);
        if (j < parts.length - 1) {
          line += '<input type="text" data-i="' + j + '" autocomplete="off" spellcheck="false" />';
        }
      });
      line += '</div>';
      html += line;
    });
    html += '<div class="quiz-result">';
    html += '<div class="score-label">Tvůj výsledek</div>';
    html += '<div class="score">0 / 0</div>';
    html += '<button class="reset" type="button">Vymazat a zkusit znovu</button>';
    html += '</div></div>';
    container.innerHTML = html;

    // Auto-check on blur
    var quizEl = container.querySelector('.quiz');
    var allInputs = container.querySelectorAll('.fill-q input');
    var totalGaps = allInputs.length;

    allInputs.forEach(function(inp) {
      inp.addEventListener('blur', checkAll);
      inp.addEventListener('input', function() {
        inp.classList.remove('is-correct', 'is-wrong');
      });
      inp.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          inp.blur();
          var inputs = Array.from(container.querySelectorAll('.fill-q input'));
          var idx = inputs.indexOf(inp);
          if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus();
        }
      });
    });

    function checkAll() {
      var got = 0, filled = 0;
      container.querySelectorAll('.fill-q').forEach(function(qEl, qi) {
        var inputs = qEl.querySelectorAll('input');
        inputs.forEach(function(inp, ii) {
          inp.classList.remove('is-correct', 'is-wrong');
          if (!inp.value.trim()) return;
          filled++;
          var ansSpec = data[qi].answers[ii] || '';
          var alts = ansSpec.split('|').map(normalize);
          if (alts.indexOf(normalize(inp.value)) !== -1) {
            inp.classList.add('is-correct');
            got++;
          } else {
            inp.classList.add('is-wrong');
          }
        });
      });
      var res = quizEl.querySelector('.quiz-result');
      res.querySelector('.score').textContent = got + ' / ' + totalGaps;
      if (filled === totalGaps) res.classList.add('is-shown');
      else res.classList.remove('is-shown');
    }

    quizEl.querySelector('.reset').addEventListener('click', function() {
      container.querySelectorAll('.fill-q input').forEach(function(inp) {
        inp.value = '';
        inp.classList.remove('is-correct', 'is-wrong');
      });
      quizEl.querySelector('.quiz-result').classList.remove('is-shown');
    });
  }

  /* =========================================================
     LEITNER (CLIL flashcards with 3 boxes + localStorage)
     - data: [{cz, en, def}]
     - container.dataset.leitnerId = unique storage key
     ========================================================= */
  function initLeitner(container) {
    var data = readJsonScript(container);
    if (!data) return;
    var storageKey = 'leitner-' + (container.dataset.leitnerId || 'default');

    // Load saved state or initialize
    var state = loadState();
    if (!state || state.cards.length !== data.length) state = freshState();

    function freshState() {
      return {
        cards: data.map(function(c, i) { return { i: i, box: 0, due: i }; }),
        seen: 0,
        cursor: 0
      };
    }
    function loadState() {
      try {
        var raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) { return null; }
    }
    function saveState() {
      try { localStorage.setItem(storageKey, JSON.stringify(state)); }
      catch (e) {}
    }

    function nextCard() {
      // Pick the card with the smallest 'due' value, tie-break by lowest box.
      var pool = state.cards.slice().sort(function(a, b) {
        if (a.due !== b.due) return a.due - b.due;
        return a.box - b.box;
      });
      // If all cards are in box 2 (mastered) and have been recently seen, we're done
      var notMastered = pool.filter(function(c) { return c.box < 2; });
      if (notMastered.length === 0) return null;
      return pool[0];
    }

    var flipped = false;
    var current = null;

    function render() {
      var box0 = state.cards.filter(function(c){ return c.box === 0; }).length;
      var box1 = state.cards.filter(function(c){ return c.box === 1; }).length;
      var box2 = state.cards.filter(function(c){ return c.box === 2; }).length;

      current = nextCard();
      flipped = false;

      var html = '<div class="leitner-head">';
      html += '<div class="leitner-counter">Pojem <strong>' + (state.seen + 1) + '</strong> · zobrazeno <strong>' + state.seen + '×</strong></div>';
      html += '<button class="leitner-reset" type="button" data-action="reset">Začít znovu</button>';
      html += '</div>';

      html += '<div class="leitner-boxes">';
      html += '<div class="leitner-box' + (current && current.box === 0 ? ' is-current' : '') + '"><div class="leitner-box-name">1 · Učím se</div><div class="leitner-box-count">' + box0 + '</div></div>';
      html += '<div class="leitner-box' + (current && current.box === 1 ? ' is-current' : '') + '"><div class="leitner-box-name">2 · Trochu znám</div><div class="leitner-box-count">' + box1 + '</div></div>';
      html += '<div class="leitner-box' + (current && current.box === 2 ? ' is-current' : '') + '"><div class="leitner-box-name">3 · Umím</div><div class="leitner-box-count">' + box2 + '</div></div>';
      html += '</div>';

      if (!current) {
        html += '<div class="leitner-done">';
        html += '<h3>Skvělé! 🎉</h3>';
        html += '<p>Všech ' + data.length + ' pojmů máš v boxu „Umím". Můžeš začít znovu nebo přejít na testík.</p>';
        html += '<button class="leitner-reset" type="button" data-action="reset">Začít znovu</button>';
        html += '</div>';
      } else {
        var c = data[current.i];
        html += '<div class="leitner-card" data-flip>';
        html += '<div class="leitner-front">' + escapeHtml(c.cz) + '</div>';
        html += '<div class="leitner-hint">↓ Klikni pro otočení</div>';
        html += '</div>';
        html += '<div class="leitner-actions" style="display:none">';
        html += '<button class="leitner-btn leitner-btn--again" data-action="again" type="button">Učím se<small>znovu brzy</small></button>';
        html += '<button class="leitner-btn leitner-btn--good" data-action="good" type="button">Trochu znám<small>uvidím později</small></button>';
        html += '<button class="leitner-btn leitner-btn--easy" data-action="easy" type="button">Umím!<small>do hotových</small></button>';
        html += '</div>';
      }

      container.innerHTML = html;

      // Bindings
      var card = container.querySelector('[data-flip]');
      var actions = container.querySelector('.leitner-actions');
      if (card) {
        card.addEventListener('click', function() {
          if (flipped) return;
          flipped = true;
          var c = data[current.i];
          card.innerHTML = '<div class="leitner-back-cz">' + escapeHtml(c.def) + '</div>'
                         + '<div class="leitner-back-en">' + escapeHtml(c.en) + '</div>'
                         + '<div class="leitner-hint">Jak ti to šlo?</div>';
          actions.style.display = 'grid';
        });
      }
      container.querySelectorAll('[data-action]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var act = btn.dataset.action;
          if (act === 'reset') {
            if (confirm('Opravdu vymazat pokrok a začít znovu?')) {
              localStorage.removeItem(storageKey);
              state = freshState();
              render();
            }
            return;
          }
          if (!current) return;
          var card = state.cards.find(function(x){ return x.i === current.i; });
          state.seen++;
          if (act === 'again') {
            card.box = 0;
            card.due = state.seen + 2;   // see again very soon
          } else if (act === 'good') {
            card.box = Math.max(card.box, 1);
            card.due = state.seen + 5;   // moderate delay
          } else if (act === 'easy') {
            card.box = 2;
            card.due = state.seen + 999; // mastered, far away
          }
          saveState();
          render();
        });
      });
    }

    render();
  }

  /* =========================================================
     STICKY HEADER & SUBNAV
     ========================================================= */
  function initStickyHeader() {
    var hdr = document.querySelector('.site-header');
    if (!hdr) return;
    function check() {
      if (window.scrollY > 4) hdr.classList.add('is-scrolled');
      else hdr.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function initSubnavScrollSpy() {
    var nav = document.querySelector('.chapter-subnav');
    if (!nav) return;
    var links = $$('.chapter-subnav a');
    var sections = links.map(function(a) {
      var id = (a.getAttribute('href') || '').slice(1);
      return id ? document.getElementById(id) : null;
    });
    function spy() {
      var y = window.scrollY + 160;
      var active = -1;
      sections.forEach(function(sec, i) {
        if (sec && sec.offsetTop <= y) active = i;
      });
      links.forEach(function(a, i) {
        a.classList.toggle('is-active', i === active);
      });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener('DOMContentLoaded', function() {
    initStickyHeader();
    initSubnavScrollSpy();
    $$('[data-quiz]').forEach(initQuiz);
    $$('[data-truefalse]').forEach(initTrueFalse);
    $$('[data-fill]').forEach(initFill);
    $$('[data-leitner]').forEach(initLeitner);

    // Auto year in footer
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });

})();
