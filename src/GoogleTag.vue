<template>
  <!-- Ce composant n'affiche rien visuellement -->
</template>
 
<script setup>
const gtmId = 'GTM-WNSDMHTM';
 
// Ce code s'exécute une seule fois à la création du composant.
// On vérifie que le script n'est pas déjà présent pour éviter les doublons.
if (!document.querySelector(`script[src*="gtm.js?id=${gtmId}"]`)) {
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),
        dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',gtmId);
}
</script>