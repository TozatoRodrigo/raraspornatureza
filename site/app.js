/* Raras por Natureza — demo. Sem dependências. Sem JS, a página fica completa e estática. */
(() => {
  'use strict';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const limita = (v, a, b) => Math.min(b, Math.max(a, v));
  const trecho = (p, a, b) => limita((p - a) / (b - a), 0, 1);
  const suave = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reais = n => 'R$ ' + n.toLocaleString('pt-BR');
  const corpo = document.body;

  /* ---------- cabeçalho e menu ---------- */
  const topo = $('.topo'), menu = $('#menu'), menuBotao = $('.menu-botao');
  function abrirMenu(abrir) {
    menuBotao.setAttribute('aria-expanded', String(abrir));
    menuBotao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    if (abrir) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('aberto')));
      document.documentElement.style.overflow = 'hidden';
    } else {
      menu.classList.remove('aberto');
      document.documentElement.style.overflow = '';
      setTimeout(() => { if (!menu.classList.contains('aberto')) menu.hidden = true; }, 380);
    }
  }
  menuBotao.addEventListener('click', () => abrirMenu(menuBotao.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { abrirMenu(false); menuBotao.focus(); } });

  // âncoras com rolagem suave (sem scroll-behavior no CSS: atrapalha o print de página inteira)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const alvo = a.getAttribute('href') === '#topo' ? document.body : $(a.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    if (!menu.hidden) abrirMenu(false);
    if (alvo === document.body) scrollTo({ top: 0, behavior: reduz ? 'auto' : 'smooth' });
    else alvo.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', a.getAttribute('href'));
  });

  /* ---------- abertura: a folha se desenha e vira janela para o vídeo ---------- */
  const ab = $('.abertura'), palco = $('.palco', ab), painel = $('.painel', ab), janela = $('.janela', ab);
  const video = $('.janela-video', ab), ouro = $('.folha-ouro', ab), veu = $('.veu', ab), enfeites = $('.enfeites', ab);
  const titulo = $('h1', ab), acoes = $('.abertura-acoes', ab), sub = $('.abertura-sub', ab), legenda = $('.legenda-video', ab);
  const F = window.FOLHA;
  let geo = null;

  const dentroDaFolha = (x, y) => {
    let d = false;
    for (let i = 0, j = F.p.length - 1; i < F.p.length; j = i++) {
      const [xi, yi] = F.p[i], [xj, yj] = F.p[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) d = !d;
    }
    return d;
  };

  function medir() {
    const W = painel.clientWidth, H = painel.clientHeight, desktop = innerWidth >= 1024;
    let h0, ax, ay;
    if (desktop) {
      h0 = Math.min(H * .78, W * 1.2);
      ax = W / 2;
      ay = H * .52 + (F.c[1] - F.h / 2) * h0 / F.h;
    } else {
      const base = palco.getBoundingClientRect().top;
      const fimTexto = titulo.getBoundingClientRect().bottom - base;
      const inicioAcoes = acoes.getBoundingClientRect().top - base;
      const livre = inicioAcoes - fimTexto - 40;
      h0 = limita(livre, 200, H * .54);
      ax = W / 2;
      ay = fimTexto + 20 + Math.max(0, (livre - h0) / 2) + F.c[1] * h0 / F.h;
    }
    const k = h0 / F.h, w0 = F.w * k;
    // menor escala em que os quatro cantos do painel ficam dentro da folha
    const cobre = s => [[0, 0], [W, 0], [0, H], [W, H]].every(([x, y]) => dentroDaFolha(F.c[0] + (x - ax) / (s * k), F.c[1] + (y - ay) / (s * k)));
    let lo = 1, hi = 60;
    while (hi - lo > .01) { const m = (lo + hi) / 2; if (cobre(m)) hi = m; else lo = m; }
    geo = { desktop, sMax: hi * 1.03 };
    const ml = ax - F.c[0] * k, mt = ay - F.c[1] * k;
    janela.style.webkitMaskSize = janela.style.maskSize = `${w0}px ${h0}px`;
    janela.style.webkitMaskPosition = janela.style.maskPosition = `${ml}px ${mt}px`;
    janela.style.transformOrigin = video.style.transformOrigin = `${ax}px ${ay}px`;
    const caixa = { left: ml + 'px', top: mt + 'px', width: w0 + 'px', height: h0 + 'px' };
    Object.assign(ouro.style, caixa, { transformOrigin: `${F.c[0] * k}px ${F.c[1] * k}px` });
    Object.assign(enfeites.style, caixa);
    enfeites.style.setProperty('--r1', `${Math.round(w0 * .66)}px`);
    enfeites.style.setProperty('--r2', `${Math.round(w0 * .84)}px`);
    quadro();
  }

  function quadro() {
    if (!geo) return;
    const curso = ab.offsetHeight - palco.offsetHeight;
    const p = reduz || curso <= 0 ? 0 : limita(-ab.getBoundingClientRect().top / curso, 0, 1);
    const s = 1 + (geo.sMax - 1) * suave(trecho(p, .04, .8));
    janela.style.transform = `scale(${s})`;
    video.style.transform = `scale(${1 / s})`;
    ouro.style.transform = `scale(${s})`;
    ouro.style.opacity = String(1 - trecho(p, .1, .45));
    enfeites.style.opacity = String(1 - trecho(p, .02, .16));
    const fim = trecho(p, .7, .9);
    veu.style.opacity = legenda.style.opacity = String(fim);
    if (!geo.desktop) {
      const sai = trecho(p, 0, .24);
      titulo.style.transform = `translateY(${-46 * sai}px)`;
      titulo.style.opacity = acoes.style.opacity = String(1 - sai);
      acoes.style.visibility = sai > .95 ? 'hidden' : '';
      sub.style.opacity = String(fim);
    }
    corpo.classList.toggle('passou-abertura', ab.getBoundingClientRect().bottom < innerHeight * .35);
  }

  /* ---------- pólen dourado na abertura ---------- */
  const tela = $('.polen', ab), ctx = tela.getContext('2d');
  let graos = [], polenAtivo = !reduz, ultimo = 0;
  function prepararPolen() {
    const d = Math.min(devicePixelRatio || 1, 2), W = palco.clientWidth, H = palco.clientHeight;
    tela.width = W * d; tela.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    graos = Array.from({ length: W < 700 ? 24 : 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: .5 + Math.random() * 1.6, vy: .06 + Math.random() * .26,
      fase: Math.random() * 6.28, amp: .1 + Math.random() * .3, a: .18 + Math.random() * .5,
    }));
  }
  function pintarPolen(t) {
    if (!polenAtivo) return;
    requestAnimationFrame(pintarPolen);
    if (t - ultimo < 30) return;
    ultimo = t;
    const W = palco.clientWidth, H = palco.clientHeight;
    ctx.clearRect(0, 0, W, H);
    for (const g of graos) {
      g.y -= g.vy; g.x += Math.sin(t * .0005 + g.fase) * g.amp;
      if (g.y < -6) { g.y = H + 6; g.x = Math.random() * W; }
      ctx.beginPath(); ctx.fillStyle = `rgba(217,192,138,${g.a * .18})`; ctx.arc(g.x, g.y, g.r * 3.2, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.fillStyle = `rgba(226,205,150,${g.a})`; ctx.arc(g.x, g.y, g.r, 0, 6.283); ctx.fill();
    }
  }

  /* ---------- revelação, desenho e animações que só rodam na tela ---------- */
  const revela = new IntersectionObserver(entradas => {
    for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('visto'); revela.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  const grupos = new Map();
  for (const el of $$('[data-revelar], [data-desenhar], [data-desenhar-folha]')) {
    const pai = el.parentElement, i = grupos.get(pai) || 0;
    grupos.set(pai, i + 1);
    if (el.matches('[data-revelar]') && i) el.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
    revela.observe(el);
  }
  const naTela = new IntersectionObserver(entradas => { for (const e of entradas) e.target.classList.toggle('fora', !e.isIntersecting); });
  $$('.abertura, .abelhas, .comprar').forEach(s => naTela.observe(s));

  /* ---------- vídeos só tocam quando aparecem ---------- */
  const tocar = v => { const r = v.play(); if (r) r.catch(() => {}); };
  const vistos = new IntersectionObserver(entradas => {
    for (const { target: v, isIntersecting } of entradas) {
      if (isIntersecting && !reduz) { if (v.preload === 'none') v.preload = 'auto'; tocar(v); } else v.pause();
    }
  }, { threshold: .2 });
  $$('video[data-quando-visivel]').forEach(v => vistos.observe(v));
  if (reduz) { video.removeAttribute('autoplay'); video.pause(); }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!reduz) tocar(video); if (!polenAtivo && !reduz) { polenAtivo = true; requestAnimationFrame(pintarPolen); } }
    else { video.pause(); polenAtivo = false; }
  }).observe(ab);

  /* ---------- faixas de nomes: correm sozinhas e aceleram com a rolagem ---------- */
  const faixas = $$('.faixa-trilho');
  let faixasVisiveis = false, velocidade = 0, ultimoY = scrollY, deslocamento = 0;
  new IntersectionObserver(([e]) => { faixasVisiveis = e.isIntersecting; if (faixasVisiveis && !reduz) requestAnimationFrame(correrFaixas); }).observe($('.faixas'));
  function correrFaixas() {
    if (!faixasVisiveis || reduz) return;
    deslocamento += .55 + Math.min(Math.abs(velocidade), 60) * .22;
    velocidade *= .9;
    faixas.forEach((f, i) => {
      const terco = f.scrollWidth / 3, x = deslocamento % terco;
      f.style.transform = `translate3d(${i ? x - terco : -x}px,0,0)`;
    });
    requestAnimationFrame(correrFaixas);
  }

  /* ---------- "como comprar": a abelha percorre a trilha conforme a rolagem ---------- */
  const trilha = $('.trilha'), abelhaTrilha = $('.trilha-abelha');
  function moverAbelhaTrilha() {
    if (!trilha || reduz) return;
    const r = trilha.getBoundingClientRect(), passosEl = $('.passos', trilha);
    const p = trecho(innerHeight * .78 - r.top, 0, r.height + innerHeight * .1);
    if (innerWidth >= 1024) {
      const largura = passosEl.clientWidth - 56;
      abelhaTrilha.style.transform = `translate3d(${6 + largura * p}px, 0, 0)`;
    } else {
      const altura = passosEl.clientHeight - 40;
      abelhaTrilha.style.transform = `translate3d(0, ${altura * p}px, 0)`;
    }
  }

  /* ---------- rolagem: um rAF por quadro ---------- */
  let agendado = false;
  function aoRolar() {
    agendado = false;
    velocidade = scrollY - ultimoY; ultimoY = scrollY;
    quadro();
    moverAbelhaTrilha();
    topo.classList.toggle('solido', ab.getBoundingClientRect().bottom < 90);
  }
  addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  let espera;
  addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(() => { medir(); prepararPolen(); aoRolar(); }, 120); });

  /* ---------- cartões: filtro, ordem, "ver mais", virar e inclinar ---------- */
  const lista = $('#lista'), itens = $$('.item', lista), contagem = $('#contagem'), botaoMais = $('#lista-mais');
  const LIMITE = 8, nomeDe = li => li.dataset.nome.toLocaleLowerCase('pt-BR');
  let filtro = 'todas', ordem = 'destaque', tudo = false;
  const comparar = {
    destaque: (a, b) => b.dataset.preco - a.dataset.preco || a.dataset.ordem - b.dataset.ordem,
    menor: (a, b) => a.dataset.preco - b.dataset.preco || a.dataset.ordem - b.dataset.ordem,
    nome: (a, b) => nomeDe(a).localeCompare(nomeDe(b), 'pt-BR'),
  };
  const surgir = (li, n) => { if (!reduz) li.animate([{ opacity: 0, transform: 'translateY(26px) scale(.86) rotate(-3deg)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: n * 55, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }); };
  function aplicar(animar) {
    const ordenados = itens.slice().sort(comparar[ordem]);
    const doFiltro = ordenados.filter(li => filtro === 'todas' || li.dataset.genero === filtro);
    const corte = tudo || doFiltro.length <= LIMITE + 2 ? doFiltro.length : LIMITE;
    let n = 0;
    for (const li of ordenados) {
      lista.appendChild(li);
      const pos = doFiltro.indexOf(li), ve = pos > -1 && pos < corte;
      li.hidden = !ve;
      if (ve && animar && n < 12) surgir(li, n);
      if (ve) n++;
    }
    contarAte(doFiltro.length);
    const faltam = doFiltro.length - corte;
    botaoMais.hidden = faltam <= 0;
    botaoMais.textContent = faltam === 1 ? 'Ver mais 1 planta' : `Ver mais ${faltam} plantas`;
  }
  let contado = Number(contagem.textContent);
  function contarAte(alvo) {
    if (reduz || alvo === contado) { contagem.textContent = String(alvo); contado = alvo; return; }
    const de = contado, t0 = performance.now();
    const passo = t => { const k = Math.min(1, (t - t0) / 500); contagem.textContent = String(Math.round(de + (alvo - de) * suave(k))); if (k < 1) requestAnimationFrame(passo); };
    contado = alvo; requestAnimationFrame(passo);
  }
  function marcar(grupo, attr, valor) { for (const b of $$(`[${attr}]`, grupo)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === valor)); }
  function filtrar(g) { filtro = g; tudo = false; marcar($('.filtros'), 'data-filtro', g); aplicar(true); }
  $('.filtros').addEventListener('click', e => { const b = e.target.closest('[data-filtro]'); if (b) filtrar(b.dataset.filtro); });
  $('.ordem').addEventListener('click', e => { const b = e.target.closest('[data-ordem]'); if (!b) return; ordem = b.dataset.ordem; marcar($('.ordem'), 'data-ordem', ordem); aplicar(true); });
  botaoMais.addEventListener('click', () => {
    const antes = new Set(itens.filter(li => !li.hidden));
    tudo = true; aplicar(false);
    const novos = itens.filter(li => !li.hidden && !antes.has(li)).sort(comparar[ordem]);
    novos.forEach((li, n) => surgir(li, Math.min(n, 12)));
    if (novos[0]) { const b = $('.add, [data-mais]', novos[0]); if (b) b.focus({ preventScroll: true }); }
  });
  aplicar(false);
  // primeira vez que a lista aparece: os cartões entram em cascata
  new IntersectionObserver(([e], obs) => { if (!e.isIntersecting) return; obs.disconnect(); itens.filter(li => !li.hidden).forEach((li, n) => surgir(li, n)); }, { threshold: .05 }).observe(lista);

  // virar o cartão: botão "i" ou toque no próprio cartão (fora dos botões)
  function virar(li, forcar) {
    const virada = forcar ?? !li.classList.contains('virada');
    li.classList.toggle('virada', virada);
    $('.carta-virar', li).setAttribute('aria-expanded', String(virada));
  }
  lista.addEventListener('click', e => {
    const li = e.target.closest('.carta');
    if (!li || e.target.closest('.item-acao')) return;
    virar(li);
  });
  // inclinação 3D leve sob o mouse
  if (ponteiroFino && !reduz) {
    lista.addEventListener('pointermove', e => {
      const li = e.target.closest('.carta'); if (!li) return;
      const r = li.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      li.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translateY(-4px)`;
    });
    lista.addEventListener('pointerout', e => { const li = e.target.closest('.carta'); if (li && !li.contains(e.relatedTarget)) li.style.transform = ''; });
  }

  /* ---------- minha lista ---------- */
  const CHAVE = 'raras-lista-v1';
  const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { return {}; } };
  let carrinho = ler();
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch { /* sem armazenamento: a lista vale só nesta visita */ } };
  const porId = Object.fromEntries(itens.map(li => [li.dataset.id, { nome: li.dataset.nome, preco: +li.dataset.preco, li }]));
  for (const id of Object.keys(carrinho)) if (!porId[id]) delete carrinho[id];

  const passoQtd = (id, q, nome) => `<div class="qtd-passo"><button type="button" data-menos="${id}" aria-label="Tirar um ${nome} da lista">−</button>` +
    `<span class="qtd" aria-live="polite">${q}</span><button type="button" data-mais="${id}" aria-label="Mais um ${nome}">+</button></div>`;
  const barra = $('#barra-lista'), barraN = $('#barra-n'), gaveta = $('#gaveta'), gavetaItens = $('#gaveta-itens');
  const nomeCampo = $('#campo-nome'), cidadeCampo = $('#campo-cidade'), enviar = $('#gaveta-enviar');
  const ZAP = 'https://wa.me/5544988378826?text=';

  function mensagem() {
    const linhas = ['Olá! Vim pelo site da Raras por Natureza e separei estas plantas:'];
    let total = 0;
    for (const [id, q] of Object.entries(carrinho)) { const p = porId[id]; total += p.preco * q; linhas.push(`• ${q}× ${p.nome} — ${reais(p.preco * q)}`); }
    linhas.push(`Total das plantas: ${reais(total)}`);
    if (nomeCampo.value.trim()) linhas.push(`Nome: ${nomeCampo.value.trim()}`);
    if (cidadeCampo.value.trim()) linhas.push(`Cidade para o frete: ${cidadeCampo.value.trim()}`);
    linhas.push('Ainda estão disponíveis? Podem calcular o frete?');
    return linhas.join('\n');
  }

  function desenharLista() {
    let qtd = 0, total = 0;
    for (const [id, { li, nome, preco }] of Object.entries(porId)) {
      const q = carrinho[id] || 0, acao = $('.item-acao', li), temPasso = !!$('.qtd-passo', acao);
      qtd += q; total += q * preco;
      li.classList.toggle('na-lista', q > 0);
      if (q && !temPasso) acao.innerHTML = passoQtd(id, q, nome);
      else if (q) $('.qtd', acao).textContent = String(q);
      else if (temPasso) acao.innerHTML = `<button type="button" class="add" data-add aria-label="Adicionar ${nome} à lista"><span aria-hidden="true">+</span></button>`;
    }
    barraN.textContent = String(qtd);
    $('#barra-rotulo').textContent = qtd === 1 ? 'planta na lista' : 'plantas na lista';
    $('#barra-total').textContent = reais(total);
    $('#gaveta-total').textContent = reais(total);
    gavetaItens.innerHTML = Object.entries(carrinho).map(([id, q]) => {
      const p = porId[id];
      return `<li><span class="g-nome">${p.nome}</span>${passoQtd(id, q, p.nome)}<span class="g-preco">${q} × ${reais(p.preco)}</span></li>`;
    }).join('');
    const tem = qtd > 0;
    corpo.classList.toggle('tem-lista', tem);
    if (tem) { barra.hidden = false; requestAnimationFrame(() => barra.classList.add('on')); }
    else { barra.classList.remove('on'); setTimeout(() => { if (!corpo.classList.contains('tem-lista')) barra.hidden = true; }, 600); if (gaveta.open) gaveta.close(); }
    enviar.href = ZAP + encodeURIComponent(mensagem());
  }

  // confete de folhinhas saindo do botão
  const CORES = ['#d4e59a', '#d06b78', '#c2a35a', '#7fd39a', '#f2cdd2'];
  function confete(origem) {
    if (reduz) return;
    const a = origem.getBoundingClientRect(), cx = a.left + a.width / 2, cy = a.top + a.height / 2;
    for (let i = 0; i < 9; i++) {
      const f = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      f.setAttribute('class', 'confete'); f.setAttribute('viewBox', '0 0 20 20'); f.style.color = CORES[i % CORES.length];
      f.innerHTML = '<use href="#folhinha"/>';
      corpo.appendChild(f);
      const ang = (i / 9) * Math.PI * 2 + Math.random() * .5, dist = 40 + Math.random() * 40;
      f.animate([
        { transform: `translate(${cx - 7}px, ${cy - 7}px) rotate(0deg) scale(.4)`, opacity: 1 },
        { transform: `translate(${cx - 7 + Math.cos(ang) * dist}px, ${cy - 7 + Math.sin(ang) * dist - 20}px) rotate(${200 + Math.random() * 200}deg) scale(1)`, opacity: 1, offset: .55 },
        { transform: `translate(${cx - 7 + Math.cos(ang) * dist * 1.2}px, ${cy + 30 + Math.sin(ang) * dist}px) rotate(${420 + Math.random() * 200}deg) scale(.7)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).finished.then(() => f.remove());
    }
  }
  // a abelha busca a planta e leva até a lista
  function entregar(origem) {
    if (reduz || barra.hidden) return;
    const a = origem.getBoundingClientRect(), b = barraN.getBoundingClientRect();
    if (!b.width) return;
    const voa = document.createElement('span');
    voa.className = 'entregadora';
    voa.innerHTML = `<span class="bob">${$('#molde-abelha').innerHTML}</span><svg class="folhinha-carga" viewBox="0 0 20 20"><use href="#folhinha"/></svg>`;
    corpo.appendChild(voa);
    const x0 = a.left + a.width / 2 - 20, y0 = a.top - 10, x1 = b.left + b.width / 2 - 20, y1 = b.top - 6;
    const vira = x1 < x0 ? ' scaleX(-1)' : '';
    voa.animate([
      { transform: `translate(${x0}px, ${y0 + 20}px) scale(.3)${vira}`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 24}px) scale(1)${vira}`, opacity: 1, offset: .18 },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 90}px) scale(1.1)${vira}`, offset: .55 },
      { transform: `translate(${x1}px, ${y1}px) scale(.55)${vira}`, opacity: 1, offset: .92 },
      { transform: `translate(${x1}px, ${y1 + 8}px) scale(.3)${vira}`, opacity: 0 },
    ], { duration: 1100, easing: 'cubic-bezier(.45,0,.25,1)' }).finished.then(() => {
      voa.remove();
      const n = barraN.parentElement; n.classList.remove('pulso'); void n.offsetWidth; n.classList.add('pulso');
    });
  }

  function mudar(id, d, origem) {
    const q = (carrinho[id] || 0) + d;
    if (q <= 0) delete carrinho[id]; else carrinho[id] = Math.min(q, 20);
    salvar(); desenharLista();
    if (d > 0 && origem) { confete(origem); requestAnimationFrame(() => entregar(origem)); }
  }
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'), mais = e.target.closest('[data-mais]'), menos = e.target.closest('[data-menos]');
    if (add) { const li = add.closest('.item'); const r = add.getBoundingClientRect(); const fantasma = { getBoundingClientRect: () => r }; mudar(li.dataset.id, 1, fantasma); const novo = $('[data-mais]', li); if (novo) novo.focus(); }
    else if (mais) mudar(mais.dataset.mais, 1, mais.closest('.gaveta') ? null : mais);
    else if (menos) mudar(menos.dataset.menos, -1);
  });
  $('.barra-abrir').addEventListener('click', () => { if (typeof gaveta.showModal === 'function') gaveta.showModal(); });
  gaveta.addEventListener('click', e => { if (e.target === gaveta) gaveta.close(); });
  $('#gaveta-limpar').addEventListener('click', () => { carrinho = {}; salvar(); desenharLista(); });
  for (const c of [nomeCampo, cidadeCampo]) c.addEventListener('input', () => { enviar.href = ZAP + encodeURIComponent(mensagem()); });

  /* ---------- início ---------- */
  medir();
  prepararPolen();
  desenharLista();
  aoRolar();
  if (reduz) { ab.classList.add('pronta'); ouro.classList.add('desenhada'); }
  else {
    requestAnimationFrame(pintarPolen);
    const comecar = () => setTimeout(() => { ab.classList.add('pronta'); ouro.classList.add('desenhada'); }, 100);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { medir(); comecar(); }); else comecar();
  }
})();
