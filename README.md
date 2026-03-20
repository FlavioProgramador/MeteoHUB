<h1 align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cloud-sun.svg" alt="MeteoHub Logo" width="120">
  <br>
  MeteoHub ☁️
</h1>

<p align="center">
  <strong>Seu dashboard meteorológico premium com previsão em tempo real, UI de vidro imersiva (Glassmorphism) e design responsivo.</strong>
</p>

## ✨ Visão Geral

O **MeteoHub** é uma aplicação web de ponta para observar e acompanhar o clima em escala mundial, construída do zero em **React e TypeScript**. Focada 100% num modelo de Design System requintado, a plataforma entrega dados complexos de API com a experiência visual mais fluida e limpa encontrada hoje, fugindo de dashboards confusos ou simplistas demais.

Consome instantaneamente a API do **OpenWeatherMap**, detalhando clima do momento, previsão completa dos próximos 5 dias, e métricas específicas (Índice de radiação UV, Poluição Qualidade do Ar - AQI, Vento e Visibilidade), tudo com background responsivo ao clima atual da região sondada!

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS Modules](https://img.shields.io/badge/css_modules-38B2AC.svg?style=for-the-badge&logo=css3&logoColor=white)

## 🚀 Principais Features 

*   **🌍 Busca Inteligente com Autocomplete:** Sugestões e históricos no clique, com suporte imediato para localizações e nomes mundiais precisos.
*   **📍 Localização Precisa via Satélite GPS:** Clique no botão de GPS e, com sua permissão, saiba as condições do lugar exato que  está no momento.
*   **⭐ Favoritos em Cache (Local Storage):** Marque pelo botão em forma de estrela suas cidades prediletas e mude de um clima ao outro rapidamente, com persistência na memória.
*   **🌗 Troca Dinâmica Light/Dark:** Tema integral do OS respeitado nativamente, além de Switch pelo botão "Mudar Tema". As transparências e as fontes reagem pixel for pixel.
*   **💧 Interface Glassmorphism Pura:** Nada de interfaces "chapadas" - Os cartões absorvem as texturas e iluminação do background lindamente.
*   **☁️ Contexto Dinâmico de Backgrounds:** Inverno em Paris? Nevasca no app. Verão no Rio de Janeiro? Dia claro na UI. Detecta e reage em cascata de visuais maravilhosos (Clean e Não Intrusivos).
*   **🌡️ Radar Detalhado de Dados Múltiplos:** Sensação Térmica em decimal, Índice UV, Velocidade e Direção (°) dos Ventos, Visibilidade e o importante Índice AQI (Qualidade Global do Ar).
*   **📉 Previsão Avançada e Gráficos:** Modelos descritivos a cada bloco de três horas que duram pelos próximos cinco dias.
*   **🚨 Sistema de Alertas Governamental (Weather Alerts):** Quando os serviços meteorológicos governamentais lançarem alertas (Enchentes, Furacões etc), o MeteoHub exibirá cards urgentes traduzindo os eventos críticos para o usuário.

## 🛠️ Stack Tecnológico

A regra era clara: **Sem frameworks UI pesados** (Tailwind substituído pelo poder brutal do Vanilla CSS puro escalável e legível), extraindo máxima performance de:

*   **Linguagens:** `TypeScript`, `TSX`, `Vanilla CSS`
*   **Ferramentas Base:** `React 18`, `Vite`
*   **Requisições Assíncronas:** `Axios`
*   **Elementos Visuais:** `Lucide React (Ícones)`, `Google Fonts (Inter / Outfit)`

## 💻 Como Rodar na sua Máquina

**1.** Faça o clone local em seu ambiente:
```bash
git clone https://github.com/SeuUser/meteo-hub.git
cd meteo-hub
```

**2.** Instale as dependências essenciais do pacote de build no contêiner local: 
```bash
npm install
```

**3.** Adquira suas Chaves de Clima:
Obtenha gratuitamente uma chave (API KEY) registrando-se lá no portal: [OpenWeatherMap API](https://openweathermap.org/api)

**4.** Configure o `.env`:
Abra a raiz do projeto e declare a key que o framework buscará nos hooks de serviços:
```env
VITE_WEATHER_API_KEY=sua_API_key_verdadeira_colada_aqui
```

**5.** Divirta-se:
Aqueça a turbina (dev mode local)
```bash
npm run dev
```

E vá para a url do terminal (`http://localhost:5173/`).

## ⚖️ Licença
Distribuído sob licença do MIT e criado para exibir qualidade UI máxima de desenvolvimento frontend num software open source de grande valia pública.
