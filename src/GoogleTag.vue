
<script>
import { onMounted } from 'vue';

export default {
  name: 'GoogleTag',
  setup() {
    onMounted(() => {
      const gtagId = 'G-66MS3P27YE';

      // Script de chargement externe
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
      document.head.appendChild(gtagScript);

      // Script de configuration inline
      const gtagConfigScript = document.createElement('script');
      gtagConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtagId}');
      `;
      document.head.appendChild(gtagConfigScript);
    });

    // Ce composant ne rend rien visuellement
    return () => null;
  },
};
</script>
