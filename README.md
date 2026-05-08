# Veri Fact

Verificação de notícias e detecção de desinformação em tempo real utilizando IA e Google Fact Check API.

## Demonstração

![Image](https://github.com/user-attachments/assets/e1fa51cb-38f1-4bdb-8c57-623b9f4548f4)

## Configuração Necessária

Para a extensão funcionar corretamente, configure as chaves de API, um arquivo `.env` na raiz do projeto com as seguintes variaveis:

```env
GOOGLE_FACT_API=GOOGLE_API_KEY
GROQ_API=GROQ_API_KEY

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```
