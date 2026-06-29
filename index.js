
// <!-- ═══════════════════════════════
// Recalcula a posição/tamanho de cada hotspot com base
// no tamanho real da imagem de fundo (background-size: contain)
// ═══════════════════════════════ -->

(function () {
   // Dimensões reais de assets/img/fundo_inicio.png
   const IMG_W = 1874;
   const IMG_H = 839;

   const hotspots = document.querySelectorAll('.personagem-hotspot');

   function posicionarHotspots() {
       const vw = window.innerWidth;
       const vh = window.innerHeight;

       const imgRatio = IMG_W / IMG_H;
       const telaRatio = vw / vh;

       let renderW, renderH, offsetX, offsetY;

       // Mesma lógica do background-size: contain
       if (telaRatio > imgRatio) {
           renderH = vh;
           renderW = renderH * imgRatio;
           offsetX = (vw - renderW) / 2;
           offsetY = 0;
       } else {
           renderW = vw;
           renderH = renderW / imgRatio;
           offsetX = 0;
           offsetY = (vh - renderH) / 2;
       }

       hotspots.forEach((el) => {
           const x = parseFloat(el.dataset.x) / 100;
           const y = parseFloat(el.dataset.y) / 100;
           const w = parseFloat(el.dataset.w) / 100;
           const h = parseFloat(el.dataset.h) / 100;

           el.style.left = (offsetX + x * renderW) + 'px';
           el.style.top = (offsetY + y * renderH) + 'px';
           el.style.width = (w * renderW) + 'px';
           el.style.height = (h * renderH) + 'px';
       });
   }

   window.addEventListener('load', posicionarHotspots);
   window.addEventListener('resize', posicionarHotspots);
   posicionarHotspots();
})();