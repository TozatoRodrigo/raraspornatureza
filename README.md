# Raras por Natureza: Website Oficial

Site institucional com experiência cinematográfica em scroll-scrub desenvolvido para a **Raras por Natureza** (coleção particular de plantas raras em Maringá, PR).

---

## Estrutura do Repositório

```text
├── index.html          # Código-fonte principal da página (HTML5, CSS3 e JS Vanilla)
├── assets/             # Mídias otimizadas (vídeo hero e imagens botânicas)
│   ├── hero-scrub.mp4  # Vídeo codificado para rolagem suave (GOP 8)
│   ├── hero-poster.jpg # Frame de abertura em alta resolução
│   ├── hero-ending.jpg # Frame de transição final
│   ├── anthurium.jpg   # Fotografia Anthurium
│   ├── monstera.jpg    # Fotografia Monstera deliciosa
│   ├── platycerium.jpg # Fotografia Platycerium superbum
│   └── cuidado.jpg     # Fotografia de cuidados e raízes
├── nginx.conf          # Configuração recomendada para Nginx / VPS
├── docker-compose.yml  # Configuração para subir com Docker em 1 comando
└── .htaccess           # Configuração de cache e compressão para Apache / cPanel
```

---

## Como Publicar no Domínio do Cliente

Este site foi construído sem dependências de compilação (sem npm, sem frameworks, sem build step). Qualquer servidor web estático serve o site imediatamente.

### Opção 1: Hospedagem com cPanel (HostGator, Locaweb, etc.)
1. Acesse o painel **cPanel** da sua hospedagem.
2. Abra o **Gerenciador de Arquivos**.
3. Navegue até a pasta raiz do seu domínio (geralmente `public_html`).
4. Envie o arquivo `index.html`, a pasta `assets` e o arquivo `.htaccess`.
5. Pronto! O site estará no ar no seu domínio com carregamento rápido e streaming do vídeo ativo.

### Opção 2: Vercel / Netlify / Cloudflare Pages / GitHub Pages
1. Conecte este repositório do GitHub à sua conta da plataforma (Vercel, Netlify ou Cloudflare Pages).
2. Deixe o diretório raiz como `/` (já está configurado na raiz).
3. Não é necessário nenhum comando de build nem pasta de saída (`output`).
4. Clique em **Deploy**. O site será publicado automaticamente com HTTPS gratuito e CDN global.

### Opção 3: VPS ou Servidor na Nuvem com Docker
Se você utiliza um servidor Linux próprio (DigitalOcean, Hetzner, AWS, Linode, etc.):
```bash
git clone https://github.com/TozatoRodrigo/raraspornatureza.git
cd raraspornatureza
docker compose up -d
```
O container iniciará o servidor Nginx otimizado na porta 80.

### Opção 4: Teste Local no Computador
Para visualizar no seu computador antes de subir:
```bash
python3 -m http.server 8080
```
Depois abra no seu navegador: `http://localhost:8080`.

---

## Características Técnicas

- **Scroll Scrub Suave**: Vídeo hero sincronizado com a rolagem do usuário via Lerp (`requestAnimationFrame`) e seek-gating de precisão.
- **Responsividade Adaptativa**: 5 travas de mídia automáticas que comutam de vídeo para imagem de alta resolução em conexões móveis, economizando dados e bateria.
- **Auditoria de Cópia**: Texto 100% em português brasileiro autêntico, sem clichês genéricos e com tipografia refinada (Cinzel e Plus Jakarta Sans).
