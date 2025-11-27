<template>
  <!-- Ce composant n'affiche rien visuellement -->
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const gtmId = 'GTM-WNSDMHTM';

  // 1. Injection du script principal dans le <head>
  // On vérifie qu'il n'est pas déjà présent pour éviter les doublons lors de la navigation
  if (!document.querySelector(`script[src*="gtm.js?id=${gtmId}"]`)) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',gtmId);
  }

  // 2. Injection de la balise <noscript> au début du <body>
  const noscriptTag = document.createElement('noscript');
  const iframeTag = document.createElement('iframe');
  iframeTag.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframeTag.height = '0';
  iframeTag.width = '0';
  iframeTag.style.display = 'none';
  iframeTag.style.visibility = 'hidden';
  noscriptTag.appendChild(iframeTag);
  document.body.prepend(noscriptTag);
});
</script>