// Monta site/index.html a partir de pagina.html, da folha (folha.mjs) e da lista (catalogo.mjs).
// uso: node montar.mjs [--producao] [--url https://...] [--saida pasta]
//   sem flags, usa PADRAO abaixo; --producao tira o noindex e troca a assinatura de demonstração.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { folha } from './folha.mjs';
import { plantas, generos, atualizadaEm } from './catalogo.mjs';

const PADRAO = { url: 'https://www.raraspornatureza.com.br', producao: true };
const args = process.argv.slice(2), arg = nome => { const i = args.indexOf(nome); return i > -1 ? args[i + 1] : null; };
const PRODUCAO = args.includes('--producao') || PADRAO.producao;
const ENDERECO = (arg('--url') || PADRAO.url).replace(/\/$/, '');
const SAIDA = arg('--saida') ? resolve(arg('--saida')) : fileURLToPath(new URL('../site/', import.meta.url));
const ROBOTS = PRODUCAO ? 'index, follow' : 'noindex, nofollow';
const ASSINATURA = PRODUCAO ? 'Site por Strivium Tech' : 'Demonstração criada por Strivium Tech';
const ZAP_NUM = '5544988378826';
const zap = texto => `https://wa.me/${ZAP_NUM}?text=${encodeURIComponent(texto)}`;
const ZAP = zap('Olá! Vim pelo site da Raras por Natureza e queria saber das plantas disponíveis.');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- glifos (traço fino, viewBox 64; pathLength para desenhar por CSS) ----------
const sym = (id, corpo) => `<symbol id="${id}" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${corpo.replace(/<(path|ellipse|circle|rect)/g, '<$1 pathLength="1"')}</g></symbol>`;
const GLIFOS = [
  sym('g-anthurium', '<path d="M32 4v10"/><path d="M32 14C28 9 20 7 14 10 7 14 6 24 10 33c5 11 14 18 22 27 8-9 17-16 22-27 4-9 3-19-4-23-6-3-14-1-18 4Z"/><path d="M32 14v44"/><path d="M32 22c-5 0-11 1-16 4M32 22c5 0 11 1 16 4M32 31c-6 1-12 3-16 7M32 31c6 1 12 3 16 7M32 41c-4 1-8 3-11 6M32 41c4 1 8 3 11 6"/>'),
  sym('g-monstera', '<path d="M32 60V36"/><path d="M32 36C20 36 8 30 7 19 6 10 14 4 24 4c4 0 7 1 8 3 1-2 4-3 8-3 10 0 18 6 17 15-1 11-13 17-25 17Z"/><path d="M8 17l12 3M7 24l13 1M10 31l12-3M56 17l-12 3M57 24l-13 1M54 31l-12-3"/><path d="M32 8v28"/><ellipse cx="25" cy="14" rx="1.6" ry="3"/><ellipse cx="39" cy="14" rx="1.6" ry="3"/>'),
  sym('g-platycerium', '<path d="M18 60c0-8 6-12 14-12s14 4 14 12"/><path d="M32 48C31 38 28 31 21 25 15 20 13 13 15 6"/><path d="M21 25c-5-1-10-1-14-5"/><path d="M26 33c-6 0-11 1-17-2"/><path d="M33 46c1-10 3-17 9-23 4-4 6-10 5-17"/><path d="M42 23c4-1 9-2 13-6"/><path d="M38 31c6 0 12 2 18 0"/>'),
  sym('g-aglaonema', '<path d="M32 4C44 14 48 30 44 44c-2 8-7 13-12 16-5-3-10-8-12-16-4-14 0-30 12-40Z"/><path d="M32 8v52"/><path d="M26 20l3 2M38 20l-3 2M24 30l4 2M40 30l-4 2M25 41l4 2M39 41l-4 2M28 50l2 1M36 50l-2 1"/>'),
  sym('g-alocasia', '<path d="M32 4v18"/><path d="M32 22c-8-6-15-8-21-8 0 18 8 34 21 46 13-12 21-28 21-46-6 0-13 2-21 8Z"/><path d="M32 22v36M32 30l-12-6M32 30l12-6M32 40l-9-3M32 40l9-3M32 49l-6-2M32 49l6-2"/>'),
  sym('g-philodendron', '<path d="M8 4c8 3 14 9 18 16"/><path d="M26 20c12-1 25 8 28 22 1 8-1 14-5 18-9-4-18-11-23-22-3-6-3-13 0-18Z"/><path d="M26 20c7 12 14 25 23 40"/><path d="M31 30l7-3M36 38l8-2M41 47l8-1"/>'),
  sym('g-begonia', '<path d="M32 6c15 1 27 11 26 26-1 15-13 25-27 25C16 57 6 47 6 34 6 19 17 7 32 6Z"/><path d="M32 33a2 2 0 1 1 3-2c0 4-5 6-8 4-4-2-4-8 0-11 5-4 13-2 15 4 3 7-2 15-10 16-9 2-17-5-17-14"/>'),
  sym('g-outras', '<path d="M32 62V14"/><path d="M32 42c-8 0-14-6-16-14 8 0 14 6 16 14Z"/><path d="M32 32c8 0 14-6 16-14-8 0-14 6-16 14Z"/><path d="M32 16c-4-4-4-9 0-13 4 4 4 9 0 13Z"/>'),
  sym('g-todas', '<path d="M32 60V30"/><path d="M32 30C22 30 14 22 14 10c12 0 18 8 18 20Z"/><path d="M32 38c10 0 18-8 18-20-12 0-18 8-18 20Z"/>'),
  sym('i-escolher', '<rect x="16" y="6" width="32" height="52" rx="6"/><path d="M28 50h8"/><path d="M32 18c-5 6-7 10-7 13a7 7 0 0 0 14 0c0-3-2-7-7-13Z"/>'),
  sym('i-conversa', '<path d="M10 14h44v28H30l-10 9v-9H10Z"/><path d="M19 24h26M19 32h16"/>'),
  sym('i-caixa', '<path d="M32 6 56 18v28L32 58 8 46V18Z"/><path d="M8 18l24 12 24-12M32 30v28"/>'),
  sym('i-cartao', '<rect x="7" y="16" width="50" height="34" rx="4"/><path d="M7 26h50M15 40h12"/>'),
  '<symbol id="folhinha" viewBox="0 0 20 20"><path d="M10 1C15 5 17 11 10 19 3 11 5 5 10 1Z" fill="currentColor"/><path d="M10 4v14" stroke="rgba(0,0,0,.25)" stroke-width="1"/></symbol>',
].join('');

// abelha verde (as do vídeo da Raras são verdes, metálicas); as asas batem por CSS
const ABELHA = '<svg class="abelha" viewBox="0 0 44 32" aria-hidden="true" focusable="false"><g class="asas"><ellipse cx="17" cy="9" rx="8" ry="5.5"/><ellipse cx="25" cy="8" rx="7" ry="5"/></g><ellipse class="corpo" cx="20" cy="19" rx="12" ry="8"/><path class="listras" d="M15 13v12M21 12v14M27 13.5v11"/><circle class="cabeca" cx="33" cy="18" r="5"/><circle class="olho" cx="35" cy="16.5" r="1.3"/><path class="antenas" d="M34 13.5c1.5-4 4-5.5 6.5-5.5M32 13c-.5-4 .5-6.5 3-8"/><path class="ferrao" d="M8.5 19.5 4 20.5"/></svg>';
const voo = (classe, estilo = '') => `<span class="${classe}"${estilo ? ` style="${estilo}"` : ''} aria-hidden="true"><span class="bob">${ABELHA}</span></span>`;

// selo que gira: texto em círculo em volta de uma folhinha
const SELO = '<svg class="selo-giro" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><defs><path id="circulo" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs><circle cx="60" cy="60" r="58" class="selo-fundo"/><g class="selo-texto"><text><textPath href="#circulo" textLength="280" lengthAdjust="spacing">COLEÇÃO PARTICULAR ✦ ENVIO PRO BRASIL ✦</textPath></text></g><use href="#folhinha" x="49" y="47" width="22" height="26" class="selo-folha"/></svg>';

const ICONE_ZAP = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.3 21.7l4.8-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.9c-1.5 0-3-.4-4.2-1.2l-.3-.2-2.8.8.8-2.8-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.3-1.7-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';
const ICONE_INSTA = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/></g><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>';

// ---------- folha ----------
const F = folha;
const pathsTraco = () => [
  `<path pathLength="1" class="t t-contorno" d="${F.contorno}"/>`,
  `<path pathLength="1" class="t t-nervura" d="${F.nervura}"/>`,
  ...F.laterais.flatMap(([e, d], i) => [`<path pathLength="1" class="t t-lateral" style="--i:${i}" d="${e}"/>`, `<path pathLength="1" class="t t-lateral" style="--i:${i}" d="${d}"/>`]),
  ...F.basais.map(d => `<path pathLength="1" class="t t-basal" d="${d}"/>`),
].join('');
const espadice = `<g class="espadice"><path d="${F.espadice}"/>${F.pintas.map(([x, y, r], i) => `<circle style="--i:${i}" cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
const FOLHA_HERO = `<svg class="folha-ouro" viewBox="0 0 498 762" aria-hidden="true" focusable="false"><g class="tracos">${pathsTraco()}</g>${espadice}</svg>`;
const FOLHA_CONTATO = `<svg class="folha-ouro folha-contato" viewBox="0 0 498 762" aria-hidden="true" focusable="false" data-desenhar-folha><g class="tracos">${pathsTraco()}</g>${espadice}</svg>`;
const MARCA = `<svg class="marca-folha" viewBox="0 0 498 762" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="${F.contorno}" stroke-width="22"/><path d="${F.nervura}" stroke-width="22"/>${[1, 4, 6, 8].flatMap(i => F.laterais[i]).map(d => `<path d="${d}" stroke-width="16"/>`).join('')}</g><path d="${F.espadice}" fill="currentColor"/></svg>`;
const RABISCO = '<svg class="rabisco" viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M3 12C40 5 80 4 120 8s58 5 76-2"/></svg>';

// ---------- lista em cartões ----------
const porGenero = Object.fromEntries(generos.map(([g]) => [g, plantas.filter(p => p.genero === g).length]));
const chip = (g, rotulo, n, ativo) => `<button type="button" data-filtro="${g}" aria-pressed="${ativo}"><svg class="chip-glifo" aria-hidden="true"><use href="#g-${g}"/></svg>${rotulo}<sup>${n}</sup></button>`;
const FILTROS = [chip('todas', 'Todas', plantas.length, true), ...generos.map(([g, r]) => chip(g, r, porGenero[g], false))].join('');
// ordem inicial: raridades primeiro (maior preço), empate na ordem da lista do site
const ordenadas = plantas.map((p, i) => ({ ...p, i })).sort((a, b) => b.preco - a.preco || a.i - b.i);
const LISTA = ordenadas.map((p, n) => {
  const nome = p.porte ? `${p.nome} (${p.porte})` : p.nome;
  return `      <li class="item carta c-${p.genero}" data-id="${p.id}" data-genero="${p.genero}" data-preco="${p.preco}" data-ordem="${p.i}" data-nome="${esc(nome)}" style="--n:${n % 4}">
        <div class="carta-giro">
          <div class="carta-frente">
            <p class="carta-preco"><span class="rs">R$</span>&nbsp;${p.preco.toLocaleString('pt-BR')}</p>
            <svg class="carta-glifo" aria-hidden="true"><use href="#g-${p.genero}"/></svg>
            <h3 class="carta-nome">${esc(p.nome)}</h3>
            <p class="carta-sub">${p.porte ? `<span class="porte">${esc(p.porte.split(', ').at(-1))}</span>` : `<span class="cientifico">${esc(p.cientifico)}</span>`}</p>
          </div>
          <div class="carta-verso">
            <p class="cientifico">${esc(p.cientifico)}${p.porte ? ` · ${esc(p.porte)}` : ''}</p>
            <p class="carta-desc">${esc(p.descricao)}</p>
          </div>
        </div>
        <button type="button" class="carta-virar" aria-expanded="false" aria-label="Ver detalhes de ${esc(nome)}"><span aria-hidden="true">i</span></button>
        <div class="item-acao"><button type="button" class="add" data-add aria-label="Adicionar ${esc(nome)} à lista"><span aria-hidden="true">+</span></button></div>
      </li>`;
}).join('\n');

// faixas de nomes em tipografia grande (correm com a rolagem)
const faixa = nomes => nomes.map(n => `<span>${n}</span><svg class="faixa-folha" aria-hidden="true"><use href="#folhinha"/></svg>`).join('');
const FAIXA_1 = faixa(['Anthurium', 'Monstera', 'Platycerium', 'Aglaonema']);
const FAIXA_2 = faixa(['Alocasia', 'Begônia', 'Philodendron', 'Episcia']);

// ---------- perguntas (espelhadas no JSON-LD) ----------
const perguntas = [
  ['Vocês enviam pra todo o Brasil?', 'Sim, por transportadoras especializadas em plantas vivas, com embalagem própria pra planta viajar sem estresse.'],
  ['Dá pra retirar em Maringá?', 'Dá. É só combinar a retirada com a gente pelo WhatsApp ou pelo direct.'],
  ['Como eu pago?', 'Por link de pagamento: Pix ou cartão de crédito, parcelado com as taxas da operadora.'],
  ['A planta ainda está disponível?', 'Muitas vezes é um exemplar só. A gente confirma no WhatsApp antes de fechar.'],
];
const FAQ = perguntas.map(([q, r], i) => `      <details class="pergunta" data-revelar${i === 0 ? ' open' : ''}><summary><span>${esc(q)}</span><span class="mais" aria-hidden="true"></span></summary><div class="resposta"><p>${esc(r)}</p></div></details>`).join('\n');

// ---------- JSON-LD ----------
const loja = {
  '@context': 'https://schema.org', '@type': 'GardenStore', '@id': `${ENDERECO}/#loja`,
  name: 'Raras por Natureza', alternateName: 'Raras por Natureza — plantas raras de coleção',
  description: 'Mudas e exemplares excedentes de uma coleção particular de plantas raras em Maringá (PR): Anthurium, Monstera, Platycerium, Aglaonema e outras raridades, com envio para todo o Brasil.',
  slogan: 'A natureza cria. Nós selecionamos o extraordinário.',
  url: `${ENDERECO}/`, image: `${ENDERECO}/og.jpg`, logo: `${ENDERECO}/favicon.svg`,
  telephone: '+55 44 98837-8826',
  address: { '@type': 'PostalAddress', addressLocality: 'Maringá', addressRegion: 'PR', addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -23.4102836, longitude: -51.9685548 },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' }],
  paymentAccepted: 'Pix, cartão de crédito', currenciesAccepted: 'BRL',
  sameAs: ['https://www.instagram.com/raras.por.natureza/', 'https://maps.google.com/?cid=8181830066758772071'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: `Plantas raras disponíveis — lista de ${atualizadaEm}`,
    itemListElement: plantas.map(p => ({
      '@type': 'Offer', price: p.preco.toFixed(2), priceCurrency: 'BRL', availability: 'https://schema.org/InStock',
      itemOffered: { '@type': 'Product', name: p.porte ? `${p.nome} (${p.porte})` : p.nome, description: p.descricao, category: p.cientifico },
    })),
  },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: perguntas.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) };
const site = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Raras por Natureza', url: `${ENDERECO}/`, inLanguage: 'pt-BR', publisher: { '@id': `${ENDERECO}/#loja` } };
const JSONLD = [loja, faq, site].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

// polígono da folha para o JS calcular a escala que cobre a tela
const FOLHA_JSON = JSON.stringify({ w: F.largura, h: F.altura, c: F.centro, p: F.poligono });

// ---------- monta ----------
const VERSAO = Date.now().toString(36);
let html = readFileSync(new URL('./pagina.html', import.meta.url), 'utf8');
const trocas = {
  URL: ENDERECO, ROBOTS, ASSINATURA, ZAP: esc(ZAP), ICONE_ZAP, ICONE_INSTA, GLIFOS, FOLHA_HERO, FOLHA_CONTATO, MARCA, RABISCO, SELO, ABELHA,
  ABELHAS_HERO: voo('orbita o1') + voo('orbita o2'),
  ABELHAS_CRUZANDO: [['16%', '0s', '13s'], ['48%', '-5s', '17s'], ['78%', '-9s', '11s']].map(([y, d, t]) => voo('cruza', `--y:${y};--d:${d};--t:${t}`)).join(''),
  ABELHA_TRILHA: voo('trilha-abelha'),
  FILTROS, LISTA, FAQ, JSONLD, FAIXA_1, FAIXA_2, FOLHA_JSON, VERSAO, ATUALIZADA: atualizadaEm, TOTAL: String(plantas.length),
};
html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => { if (!(k in trocas)) throw new Error(`marcador sem valor: ${k}`); return trocas[k]; });
mkdirSync(resolve(SAIDA, 'img'), { recursive: true });
writeFileSync(resolve(SAIDA, 'index.html'), html);

writeFileSync(resolve(SAIDA, 'img/folha-mascara.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 498 762"><path d="${F.contorno}" fill="#000"/></svg>`);
writeFileSync(resolve(SAIDA, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -10 758 782"><rect x="-130" y="-10" width="758" height="782" rx="150" fill="#03261a"/><path d="${F.contorno}" fill="#15361f" stroke="#c2a35a" stroke-width="26" stroke-linejoin="round"/><path d="${F.nervura}" stroke="#c2a35a" stroke-width="24" stroke-linecap="round"/><path d="${F.espadice}" fill="#c2a35a"/></svg>`);
console.log(`ok: ${resolve(SAIDA, 'index.html')} (${(html.length / 1024).toFixed(1)} KB), ${plantas.length} plantas, ${PRODUCAO ? 'produção' : 'demonstração'}, ${ENDERECO}`);
