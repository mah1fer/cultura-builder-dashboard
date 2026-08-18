# 🚀 Cultura Builder - CRM & Leads Dashboard

Dashboard independente em **React + Vite + TypeScript + Tailwind CSS + shadcn/ui** para visualização, gestão e acompanhamento dos contatos, disparos de mensagens, taxa de respostas e termômetro de interesse.

---

## 📦 Como rodar localmente

1. Entre no diretório do projeto:
   ```bash
   cd cultura-builder-dashboard
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse: `http://localhost:5173`

---

## 🌐 Como fazer Deploy na Vercel (1 Minuto)

1. Crie um repositório no seu GitHub (ex: `cultura-builder-dashboard`).
2. Suba o código para o GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial dashboard commit"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/cultura-builder-dashboard.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
4. Importe o repositório do GitHub.
5. O Vercel detectará automaticamente o framework **Vite** e executará o build. Clique em **Deploy**!

---

## ✨ Recursos

- 📊 **Métricas e KPIs:** Total impactados, respostas, taxa de resposta (% Reply Rate), alto interesse e funil comercial.
- 📋 **Tabela Interativa:** Busca instantânea, filtros por Lote, Status, Ocupação e Termômetro de Interesse.
- 💬 **Drawer de Detalhes:** Visualização completa dos 4 blocos de mensagens disparados para cada contato.
- 📲 **Click-to-Chat no WhatsApp:** Abertura direta do chat no WhatsApp Web com um clique.
- 💾 **Persistência Local (`localStorage`):** Todas as alterações de status, interesse e anotações ficam salvas no navegador.
- 📥 **Exportação & Importação:** Exporte para CSV (Excel/Sheets) ou JSON a qualquer momento.
