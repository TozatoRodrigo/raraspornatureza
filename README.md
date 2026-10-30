# Raras por Natureza — site

Site da Raras por Natureza (plantas raras de coleção, Maringá – PR): uma página só, com a abertura em que a folha
da logo se desenha e vira uma janela para o vídeo do Anthurium, a lista de plantas à venda em cartões, o passo a
passo de compra, guias de cultivo, perguntas frequentes e contato.

HTML, CSS e JavaScript puros: sem framework, sem banco de dados e sem etapa de build para publicar. Qualquer
servidor de arquivos estáticos serve o site.

## O que tem aqui

```text
site/        o site pronto: é esta pasta que vai para o servidor
  index.html
  estilo.css, app.js
  img/, video/, og.jpg (imagem que aparece ao compartilhar o link), favicon.svg
  robots.txt, sitemap.xml, .htaccess (Apache/cPanel), vercel.json (Vercel)
fonte/       para atualizar a lista de plantas e gerar o index.html de novo
  catalogo.mjs   a lista de plantas (nome, nome científico, descrição, preço, porte)
  pagina.html    o modelo da página
  montar.mjs     junta tudo e grava site/index.html
  folha.mjs      o desenho da folha da logo em SVG
nginx.conf, docker-compose.yml   exemplo para publicar numa VPS com Nginx
```

## Como atualizar a lista de plantas

1. Abra `fonte/catalogo.mjs`. Cada planta é uma linha:

   ```js
   ['anthurium-luxurians-inhotim', 'Anthurium Luxurians', 'Anthurium luxurians', 'Folhagem enrugada e texturizada…', 700, 'grande, linhagem Inhotim'],
   ```

   Na ordem: um identificador sem espaço nem acento, o nome, o nome científico, a descrição curta, o preço em reais
   e, se quiser, o porte. Para tirar uma planta, apague a linha; para incluir, copie uma linha e troque os dados.
   O filtro do site sai da primeira palavra do nome (Aglaonema, Alocasia, Anthurium, Begonia, Monstera,
   Philodendron, Platycerium; o resto entra em "Outras").
2. Troque a data em `atualizadaEm` (ela aparece em cima da lista).
3. Na raiz do projeto, rode (precisa do Node.js 18 ou mais novo):

   ```bash
   node fonte/montar.mjs
   ```

4. Publique a pasta `site/` de novo.

O `montar.mjs` também atualiza os dados estruturados do Google (lista de ofertas com preço, perguntas frequentes,
horário e contato da loja). O WhatsApp e o Instagram estão em `fonte/montar.mjs`, `fonte/pagina.html` e `site/app.js`.

## Como publicar

O endereço oficial configurado é `https://www.raraspornatureza.com.br` (link canônico, imagem de compartilhamento
e dados do Google). Se o site for para outro endereço, rode `node fonte/montar.mjs --url https://outro-endereco`.

**VPS com Nginx (como o servidor atual):** copie o conteúdo de `site/` para a raiz do site no servidor. As pastas
que já existem lá e não fazem parte deste projeto (`/blog/`, `/gestao/`) continuam funcionando: a página tem links
para os guias do blog. O `nginx.conf` deste projeto é um exemplo de configuração (compressão, cache, vídeo e
bloqueio de arquivos ocultos).

**Docker:** `docker compose up -d` sobe um Nginx na porta 80 servindo só a pasta `site/`.

**Hospedagem com cPanel:** envie o conteúdo de `site/` (incluindo o `.htaccess`) para `public_html`.

**Vercel, Netlify ou Cloudflare Pages:** conecte o repositório e use `site` como pasta raiz, sem comando de build.

Depois de publicar, vale mandar o `sitemap.xml` no Google Search Console.

## Bom saber

- Os vídeos tocam só quando aparecem na tela e a página respeita quem desativa animações no celular: nesse caso
  ela aparece parada e completa.
- A lista que o visitante monta fica salva no navegador dele e vai pronta para o WhatsApp da loja, com o total e a
  cidade para o frete.
- Fontes: Cormorant Garamond e Hanken Grotesk, carregadas do Google Fonts.

Site por [Strivium Tech](https://www.striviumtech.com.br).
