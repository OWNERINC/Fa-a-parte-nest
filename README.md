# faca_parte_nest

Landing page estatica para a campanha NEST.

## Estrutura

```text
faca_parte_nest/
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── copys/
    ├── logos/
    ├── images/
    ├── videos/
    └── icons/
```

## Como Usar

1. Coloque o arquivo de copy/direcional em `assets/copys/`.
2. Coloque logos vetorizados em `assets/logos/`.
3. Fotos podem ficar como placeholders por enquanto.
4. Videos serao embeds do YouTube; troque o `data-youtube-id` no `index.html` pelo ID final.
5. Icones usam Lucide via CDN, com atributos `data-lucide` no HTML.

## Integracao do formulario (Zapier)

O formulario de contato (`#formulario`) envia os leads via webhook para o Zapier,
que distribui os dados (ex.: RD Station, planilha, WhatsApp) a partir dali.

- URL do webhook: definida em `ZAPIER_WEBHOOK_URL` em `script.js`.
- Envio via `fetch` com `mode: 'no-cors'` e body `application/x-www-form-urlencoded`
  (necessario porque o Catch Hook do Zapier nao retorna headers de CORS; com
  `no-cors` a resposta fica opaca, entao o site sempre assume sucesso apos o
  fetch resolver e so mostra erro se a propria chamada de rede falhar).
- Campos enviados: `nome`, `telefone`, `email`, `aceite` (`sim`/`nao`),
  `pagina` (URL de origem) e `enviado_em` (timestamp ISO).
- Para trocar o destino, basta atualizar o valor de `ZAPIER_WEBHOOK_URL`.

## Status

- Formulario conectado ao Zapier via webhook (ver secao acima).
- Imagens em placeholder ate receber direcional final.
- Videos via YouTube.
- Icones via Lucide CDN.
- Tipografia via Google Fonts: Montserrat e Raleway.
- Direcao visual: clean, clara, off-white, tons terrosos, respiro amplo e luxo contemporaneo.
- Sem deploy configurado ainda.
