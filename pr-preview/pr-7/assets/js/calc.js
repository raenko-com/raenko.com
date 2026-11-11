(function () {
  "use strict";

  var DATA = window.RC_PRICES;
  var ICONS = {
    site: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M9 4v16"/>',
    bot: '<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M9 9.5h.01M15 9.5h.01M9 13c1.6 1.3 4.4 1.3 6 0"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5l2 2.6 3.2-.7.7 3.2 2.6 2-1.6 2.4 1.6 2.4-2.6 2-.7 3.2-3.2-.7-2 2.6-2-2.6-3.2.7-.7-3.2-2.6-2 1.6-2.4L3.5 9.6l2.6-2 .7-3.2 3.2.7z"/>',
    "case": '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/>',
    term: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7.5 9.5l3 2.5-3 2.5M12.5 15h4"/>',
    promo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'
  };

  var state = { step: 1, groups: {}, opts: {} };
  DATA.groups.forEach(function (g) {
    state.groups[g.id] = false;
    g.options.forEach(function (o) { state.opts[g.id + ":" + o.id] = !!o.on; });
  });

  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽"; };
  var round5 = function (n, up) { return (up ? Math.ceil : Math.floor)(n / 5000) * 5000; };

  function plural(n, a, b, c) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return a;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return b;
    return c;
  }
  function ico(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + "</svg>";
  }
  function group(id) { return DATA.groups.filter(function (g) { return g.id === id; })[0]; }
  function isOn(g, o) { return state.opts[g.id + ":" + o.id]; }
  function hasBase(g) { return g.options.some(function (o) { return o.type === "base" && isOn(g, o); }); }
  function included(o) { return o.includedWith && state.groups[o.includedWith]; }
  function available(g, o) { return !(o.needsBase && !hasBase(g)) && !included(o); }

  /* ---------- шаг 1: карточки направлений ---------- */
  function renderCards() {
    $("rc-cards").innerHTML = DATA.groups.map(function (g) {
      var c = g.card;
      var meta = c.monthly ? "от " + fmt(c.from) + " / мес" : "от " + fmt(c.from) + " · от " + c.days + " " + plural(c.days, "дня", "дней", "дней");
      return '<button type="button" class="rc-card" data-group="' + g.id + '" aria-pressed="false">' +
        '<span class="rc-card-ico">' + ico(g.icon) + "</span>" +
        '<span class="rc-card-txt"><b>' + g.title + "</b><span>" + g.hint + "</span><em>" + meta + "</em></span>" +
        '<span class="rc-check" aria-hidden="true"></span></button>';
    }).join("");
  }

  /* ---------- шаг 2: опции выбранных направлений ---------- */
  function renderGroups() {
    $("rc-groups").innerHTML = DATA.groups.filter(function (g) { return state.groups[g.id]; }).map(function (g) {
      var bases = g.options.filter(function (o) { return o.type === "base"; });
      var html = '<fieldset class="rc-group"><legend><span class="rc-group-ico">' + ico(g.icon) + "</span>" + g.title + "</legend>";
      if (bases.length) html += '<p class="rc-group-k">Основа, выберите одно</p>';
      g.options.forEach(function (o, i) {
        var prev = g.options[i - 1];
        if (o.section) {
          if (!prev || prev.section !== o.section) html += '<p class="rc-group-k">' + o.section + "</p>";
        } else if (o.type === "extra" && bases.length && (i === 0 || prev.type === "base")) {
          html += '<p class="rc-group-k">Дополнительно</p>';
        }
        var key = g.id + ":" + o.id;
        var radio = o.type === "base";
        var dis = !available(g, o);
        var free = o.price && !o.price[1];
        var price = o.quote ? "по оценке" : free ? "входит" : o.monthly ? fmt(o.price[0]) + "/мес" :
          (o.type === "extra" && o.needsBase ? "+" : "") + fmt(o.price[0]).replace(" ₽", "") + "–" + fmt(o.price[1]);
        var note = included(o) ? "Уже входит в сайт" : o.needsBase && !hasBase(g) ? "Сначала выберите основу" : o.note || "";
        html += '<label class="rc-opt' + (dis ? " is-dis" : "") + '">' +
          '<input type="' + (radio ? "radio" : "checkbox") + '" name="' + (radio ? "b-" + g.id : key) + '" data-key="' + key + '"' +
          (isOn(g, o) && !dis ? " checked" : "") + (dis ? " disabled" : "") + ">" +
          '<span class="rc-mark" aria-hidden="true"></span>' +
          '<span class="rc-opt-txt"><b>' + o.title + "</b>" + (note ? "<small>" + note + "</small>" : "") + "</span>" +
          '<span class="rc-opt-p">' + (included(o) ? "входит" : price) + "</span></label>";
      });
      return html + "</fieldset>";
    }).join("");
  }

  /* ---------- расчёт ---------- */
  function calc() {
    var res = { min: 0, max: 0, monthly: 0, quote: false, lines: [], groupDays: [] };
    DATA.groups.forEach(function (g) {
      if (!state.groups[g.id]) return;
      var dmin = 0, dmax = 0, any = false;
      g.options.forEach(function (o) {
        if (!isOn(g, o) || !available(g, o)) return;
        any = true;
        if (o.quote) { res.quote = true; res.lines.push({ t: o.title, p: "по оценке" }); return; }
        if (o.monthly) { res.monthly += o.price[0]; return; }
        if (!o.price[1]) { res.lines.push({ t: o.title, p: "входит" }); return; }
        res.min += o.price[0]; res.max += o.price[1];
        if (o.days) { dmin += o.days[0]; dmax += o.days[1]; }
        res.lines.push({ t: o.title, p: short(o.price[0]) + "–" + short(o.price[1]) });
      });
      if (dmax) res.groupDays.push([dmin, dmax]);
      if (!any) res.lines.push({ t: g.title, p: "выберите опции", warn: true });
    });
    // Направления частично идут параллельно: самое долгое + 40% остальных.
    var t = [0, 0];
    [0, 1].forEach(function (k) {
      var arr = res.groupDays.map(function (d) { return d[k]; });
      if (!arr.length) return;
      var mx = Math.max.apply(null, arr), sum = arr.reduce(function (a, b) { return a + b; }, 0);
      t[k] = Math.round(mx + 0.4 * (sum - mx));
    });
    res.days = t;
    return res;
  }
  function short(n) { return n >= 1000 ? Math.round(n / 1000) + "к" : String(n); }

  function daysText(d) {
    if (!d[1]) return "";
    if (d[1] <= 12) return d[0] + "–" + d[1] + " рабочих " + plural(d[1], "день", "дня", "дней");
    var w0 = Math.max(1, Math.round(d[0] / 5)), w1 = Math.max(w0 + 1, Math.ceil(d[1] / 5));
    return w0 + "–" + w1 + " " + plural(w1, "неделя", "недели", "недель");
  }

  function renderSum() {
    var any = DATA.groups.some(function (g) { return state.groups[g.id]; });
    var r = calc();
    var total, time;
    if (!any) {
      total = "—"; time = "Выберите направление, и мы покажем ориентир";
    } else if (state.step === 1) {
      var from = DATA.groups.filter(function (g) { return state.groups[g.id] && !g.card.monthly; })
        .reduce(function (s, g) { return s + g.card.from; }, 0);
      total = from ? "от " + fmt(from) : "—";
      time = "Уточните детали на следующем шаге";
    } else if (r.max) {
      total = "≈ " + fmt(round5(r.min)).replace(" ₽", "") + " – " + fmt(round5(r.max, true));
      time = "Срок: " + daysText(r.days);
    } else if (r.monthly) {
      total = fmt(r.monthly) + " / мес"; time = "Ежемесячно";
    } else if (r.quote) {
      total = "По оценке"; time = "Посчитаем после обсуждения";
    } else {
      total = "—"; time = "Отметьте хотя бы одну опцию";
    }
    $("rc-total").textContent = total;
    $("rc-time").textContent = time;
    $("rc-bar-total").textContent = total;

    var lines = state.step === 2 ? r.lines : [];
    if (state.step === 2 && r.monthly && r.max) lines = lines.concat([{ t: "Ежемесячно", p: short(r.monthly) + "/мес", extra: true }]);
    $("rc-lines").innerHTML = lines.map(function (l) {
      return '<li class="' + (l.warn ? "is-warn" : "") + '"><span>' + l.t + "</span><b>" + l.p + "</b></li>";
    }).join("");

    var notes = [];
    if (state.groups.site && state.step === 2) notes.push("Базовое SEO и аналитика уже входят в сайт");
    if (state.groups.promo && state.step === 2) notes.push("Рекламный бюджет оплачивается отдельно");
    if (state.step === 2 && r.groupDays.length > 1) notes.push("Часть работ идёт параллельно, поэтому срок меньше суммы");
    $("rc-notes").innerHTML = notes.map(function (n) { return "<li>" + n + "</li>"; }).join("");

    $("rc-cta").disabled = !any;
    $("rc-next").disabled = !any;
    $("rc-bar").hidden = !any || sumVisible;
  }

  function goto(step) {
    state.step = step;
    document.querySelectorAll(".rc-panel").forEach(function (p) { p.hidden = +p.dataset.step !== step; });
    document.querySelectorAll(".rc-step").forEach(function (s) {
      var n = +s.dataset.stepDot;
      s.classList.toggle("is-active", n === step);
      s.classList.toggle("is-done", n < step);
    });
    if (step === 2) renderGroups();
    renderSum();
    var top = $("calculator").getBoundingClientRect().top;
    if (top < 0) $("calculator").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- события ---------- */
  $("rc-cards").addEventListener("click", function (e) {
    var b = e.target.closest(".rc-card");
    if (!b) return;
    var id = b.dataset.group;
    state.groups[id] = !state.groups[id];
    b.setAttribute("aria-pressed", state.groups[id]);
    renderSum();
  });
  $("rc-next").addEventListener("click", function () { goto(2); });
  $("rc-back").addEventListener("click", function () { goto(1); });

  $("rc-groups").addEventListener("change", function (e) {
    var inp = e.target;
    if (!inp.dataset.key) return;
    var parts = inp.dataset.key.split(":"), g = group(parts[0]);
    if (inp.type === "radio") {
      g.options.forEach(function (o) { if (o.type === "base") state.opts[g.id + ":" + o.id] = o.id === parts[1]; });
    } else {
      state.opts[inp.dataset.key] = inp.checked;
    }
    renderGroups();
    renderSum();
  });

  $("rc-cta").addEventListener("click", function () {
    var r = calc();
    var txt = ["Здравствуйте! Хочу обсудить проект.", ""];
    DATA.groups.forEach(function (g) {
      if (!state.groups[g.id]) return;
      var picked = g.options.filter(function (o) { return isOn(g, o) && available(g, o); }).map(function (o) { return o.title; });
      txt.push(g.title + (picked.length && state.step === 2 ? ": " + picked.join("; ") : ""));
    });
    if (r.monthly && state.step === 2) txt.push("Ежемесячно: " + fmt(r.monthly));
    txt.push("", "Оценка калькулятора: " + $("rc-total").textContent + (r.days[1] && state.step === 2 ? ", " + daysText(r.days) : ""));
    /* на сайте: подставляем расчёт в форму заявки рядом */
    var msg = document.querySelector("#lead-form textarea[name=msg]");
    if (msg) {
      msg.value = txt.join("\n");
      document.getElementById("lead-form").scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () { var n = document.querySelector("#lead-form input[name=name]"); if (n) n.focus({ preventScroll: true }); }, 600);
      return;
    }
    $("rc-req").value = txt.join("\n");
    var d = $("rc-dialog");
    if (d.showModal) d.showModal(); else alert(txt.join("\n"));
  });

  /* липкая панель не нужна, когда сам итог на экране */
  var sumVisible = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      sumVisible = en[0].isIntersecting;
      renderSum();
    }).observe($("rc-sum"));
  }

  renderCards();
  renderSum();
})();
