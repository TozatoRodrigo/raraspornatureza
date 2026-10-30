// Folha da logo da Raras por Natureza redesenhada em SVG (contorno, nervuras e espádice), a partir da logo da
// marca. Usada na abertura, no cabeçalho, no favicon e na máscara do vídeo. `node fonte/folha.mjs` imprime o SVG.
const C = 249, f = n => +n.toFixed(1), P = ([x, y]) => `${f(x)},${f(y)}`, mir = ([x, y]) => [2 * C - x, y];
const T = [C, 14], W = [487, 427], Bd = [268, 752], Fd = [C, 598];   // ponta, barriga, ponta da base, fenda
const up = [[345, 150], [487, 330]], dn = [[487, 530], [360, 700]];
const bez = (a, b, c, d, t) => { const u = 1 - t; return [0, 1].map(i => u*u*u*a[i] + 3*u*u*t*b[i] + 3*u*t*t*c[i] + t*t*t*d[i]); };

const margem = [];
for (let i = 0; i <= 300; i++) margem.push(bez(T, up[0], up[1], W, i / 300));
for (let i = 1; i <= 300; i++) margem.push(bez(W, dn[0], dn[1], Bd, i / 300));
const xMargem = y => margem.reduce((m, p) => Math.abs(p[1] - y) < Math.abs(m[1] - y) ? p : m)[0];

const contorno = `M${P(T)} C${P(up[0])} ${P(up[1])} ${P(W)} C${P(dn[0])} ${P(dn[1])} ${P(Bd)} C${P([262, 700])} ${P([255, 640])} ${P(Fd)} `
  + `C${P(mir([255, 640]))} ${P(mir([262, 700]))} ${P(mir(Bd))} C${P(mir(dn[1]))} ${P(mir(dn[0]))} ${P(mir(W))} C${P(mir(up[1]))} ${P(mir(up[0]))} ${P(T)}Z`;

// nervuras laterais: [y onde sai da nervura central, y onde encosta na margem]
const pares = [[96, 46], [176, 82], [252, 126], [330, 172], [410, 222], [470, 282], [520, 346], [556, 410], [580, 470], [594, 540]];
const veia = ([y0, ye], i) => {
  const xe = xMargem(ye) - 3, L = Math.hypot(xe - C, y0 - ye), a = (42 - i * 2.2) * Math.PI / 180;
  return [[C, y0], [C + Math.cos(a) * L * 0.36, y0 - Math.sin(a) * L * 0.36], [xe - (xe - C) * 0.10, ye + (y0 - ye) * 0.42], [xe, ye]];
};
const curva = v => `M${P(v[0])} C${P(v[1])} ${P(v[2])} ${P(v[3])}`;
const veias = pares.map(veia);
// cada par (esquerda, direita), de cima para baixo
const laterais = veias.map(v => [curva(v.map(mir)), curva(v)]);
const basais = [`M${C},598 C${C - 40},606 ${C - 120},618 ${f(2 * C - xMargem(640)) + 4},640`,
  `M${C},598 C${C + 40},606 ${C + 120},618 ${f(xMargem(640)) - 4},640`];
const nervura = `M${C},20 L${C},598`;
const espadice = `M${C},212 C${C + 9},222 ${C + 15},262 ${C + 15},322 C${C + 15},360 ${C + 12},384 ${C},388 C${C - 12},384 ${C - 15},360 ${C - 15},322 C${C - 15},262 ${C - 9},222 ${C},212Z`;
let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280; const pintas = [];
for (let k = 0; k < 34; k++) { const y = 232 + rnd() * 145, w = 11 * Math.min(1, (y - 212) / 60); pintas.push([f(C + (rnd() * 2 - 1) * w), f(y), f(0.9 + rnd() * 1.1)]); }

// contorno amostrado (para o JS calcular quanto a folha precisa crescer para cobrir a tela)
const poligono = [...margem, ...margem.slice().reverse().map(mir)].filter((_, i) => i % 6 === 0).map(([x, y]) => [Math.round(x), Math.round(y)]);

export const folha = { largura: 498, altura: 762, centro: [C, 430], contorno, nervura, laterais, basais, espadice, pintas, poligono };

if (import.meta.url === `file://${process.argv[1]}`) {
  const g = '#c2a35a';
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 498 762" width="498" height="762"><g fill="none" stroke="${g}" stroke-linecap="round" stroke-linejoin="round">
<path d="${contorno}" stroke-width="4"/><path d="${nervura}" stroke-width="5"/>
${laterais.flat().map(d => `<path d="${d}" stroke-width="2.4"/>`).join('')}${basais.map(d => `<path d="${d}" stroke-width="2.4"/>`).join('')}</g>
<path d="${espadice}" fill="${g}"/>${pintas.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1a2a14"/>`).join('')}</svg>`);
}
