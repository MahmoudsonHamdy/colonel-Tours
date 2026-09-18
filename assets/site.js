/* ══ Colonel Tours — Shared Site Script ══
   Theme toggle, language toggle, mobile nav, footer year.
   Used by destinations.html and /visas/*.html
*/
(function(){
  const ROOT = document.documentElement;

  /* THEME */
  let isDark = true;
  const savedTheme = null; // no localStorage per artifact/browser-storage rules — session only
  window.toggleTheme = function(){
    isDark = !isDark;
    ROOT.setAttribute('data-theme', isDark ? 'dark' : 'light');
  };

  /* LANGUAGE */
  let isAR = true;
  window.toggleLang = function(){
    isAR = !isAR;
    ROOT.setAttribute('lang', isAR ? 'ar' : 'en');
    ROOT.setAttribute('dir', isAR ? 'rtl' : 'ltr');
    const btn = document.getElementById('lbtn');
    if(btn) btn.textContent = isAR ? 'EN' : 'عر';
    document.querySelectorAll('[data-ar][data-en]').forEach(el=>{
      const t = isAR ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if(!t) return;
      if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){ el.placeholder = t; }
      else{ el.innerHTML = t; }
    });
    if(typeof window.refreshUsdPrices === 'function') window.refreshUsdPrices();
    if(typeof window.onLangChange === 'function') window.onLangChange(isAR);
  };
  window.isARLang = function(){ return isAR; };

  /* MOBILE NAV */
  window.toggleNav = function(){
    const nl = document.getElementById('nl');
    if(nl) nl.classList.toggle('open');
  };

  /* FOOTER YEAR */
  document.addEventListener('DOMContentLoaded', function(){
    const yr = document.getElementById('yr');
    if(yr) yr.textContent = new Date().getFullYear();
  });

  /* IMAGE FADE-IN — avoid abrupt pop-in as lazy images load */
  function markLoaded(img){ img.classList.add('img-loaded'); }
  function initImageFade(){
    document.querySelectorAll('img').forEach(img=>{
      if(img.complete){ markLoaded(img); } /* already finished (success OR failure) — show it either way */
      else{
        img.addEventListener('load', ()=>markLoaded(img), {once:true});
        img.addEventListener('error', ()=>markLoaded(img), {once:true});
      }
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', initImageFade);
  } else {
    initImageFade();
  }

  /* FLIGHT ESTIMATE CALCULATOR */
  window.calcFlight = function(widgetId){
    const w = document.getElementById(widgetId);
    if(!w) return;
    const min = w.dataset.min, max = w.dataset.max;
    const countryAr = w.dataset.countryAr, countryEn = w.dataset.countryEn;
    const fromSel = w.querySelector('.vflight-from');
    const fromAr = fromSel.options[fromSel.selectedIndex].text;
    const fromEn = fromSel.options[fromSel.selectedIndex].dataset.en || fromAr;
    const result = w.querySelector('.vflight-result');
    const isAR = window.isARLang ? window.isARLang() : true;
    const waMsg = encodeURIComponent(`مرحباً، عايز سعر تذكرة طيران رايح-جاي من ${fromAr} لـ ${countryAr}`);
    result.innerHTML = `
      <div class="vflight-range">${isAR?'من':'From'} ${min}$ ${isAR?'إلى':'to'} ${max}$</div>
      <div class="vflight-note" data-ar="سعر تقريبي لتذكرة الطيران الاقتصادية رايح-جاي، بيختلف حسب موعد السفر وتوفر المقاعد. للسعر الفعلي المحدث تواصل معانا." data-en="Approximate round-trip economy fare, varies by travel dates and seat availability. Contact us for the current live price.">${isAR?'سعر تقريبي لتذكرة الطيران الاقتصادية رايح-جاي، بيختلف حسب موعد السفر وتوفر المقاعد. للسعر الفعلي المحدث تواصل معانا.':'Approximate round-trip economy fare, varies by travel dates and seat availability. Contact us for the current live price.'}</div>
      <a href="https://wa.me/201126672801?text=${waMsg}" target="_blank" class="vflight-wa">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.1-1.34A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
        <span data-ar="اطلب السعر الفعلي على واتساب" data-en="Get live price on WhatsApp">${isAR?'اطلب السعر الفعلي على واتساب':'Get live price on WhatsApp'}</span>
      </a>`;
    result.style.display = 'block';
  };

  /* ══ FAVORITES (localStorage-based, no login needed) ══ */
  const FAV_KEY = 'ct_favorites';
  function getFavorites(){
    try{ return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }catch(e){ return []; }
  }
  function setFavorites(list){
    try{ localStorage.setItem(FAV_KEY, JSON.stringify(list)); }catch(e){}
    updateFavCountBadge();
  }
  window.isFavorite = function(slug){ return getFavorites().includes(slug); };
  window.toggleFavorite = function(slug, btnEl){
    let list = getFavorites();
    if(list.includes(slug)){
      list = list.filter(s => s !== slug);
      if(btnEl) btnEl.classList.remove('saved');
    } else {
      list.push(slug);
      if(btnEl) btnEl.classList.add('saved');
    }
    setFavorites(list);
  };
  function updateFavCountBadge(){
    const n = getFavorites().length;
    document.querySelectorAll('.fav-count').forEach(el=>{
      el.textContent = n;
      el.classList.toggle('show', n > 0);
    });
  }
  function initFavoriteButtons(){
    document.querySelectorAll('[data-fav-slug]').forEach(btn=>{
      const slug = btn.dataset.favSlug;
      if(window.isFavorite(slug)) btn.classList.add('saved');
      btn.addEventListener('click', (e)=>{
        e.preventDefault(); e.stopPropagation();
        window.toggleFavorite(slug, btn);
      });
    });
    updateFavCountBadge();
  }

  /* ══ USD PRICE ESTIMATE ══ */
  const EGP_PER_USD = 50.2; // approximate — update this number if the rate moves significantly
  window.egpToUsd = function(egp){
    return Math.round(egp / EGP_PER_USD);
  };
  function initUsdPrices(){
    const isAR = window.isARLang && window.isARLang();
    document.querySelectorAll('[data-egp]').forEach(el=>{
      const egp = parseFloat(el.dataset.egp) || 0;
      const extra = parseFloat(el.dataset.usdExtra) || 0;
      const isVariable = el.dataset.variable === '1';
      const isFrom = el.dataset.egpFrom === '1';
      const usd = window.egpToUsd(egp) + extra;
      const plus = isVariable ? '+' : '';
      const fromWord = isFrom ? (isAR ? 'من ' : 'from ') : '';
      el.textContent = isAR ? `≈ ${fromWord}${usd}$${plus}` : `≈ ${fromWord}$${usd}${plus}`;
    });
  }
  window.refreshUsdPrices = initUsdPrices;

  document.addEventListener('DOMContentLoaded', function(){
    initFavoriteButtons();
    initUsdPrices();
  });

  /* ══ PDF DOCUMENT CHECKLIST DOWNLOAD ══ */
  window.downloadDocsPdf = function(slug, nameAr, nameEn){
    if(typeof window.jspdf === 'undefined'){
      alert('PDF library failed to load — please check your internet connection and try again.');
      return;
    }
    // NOTE: jsPDF's built-in fonts only support Latin (WinAnsi) characters — Arabic text
    // renders as garbled/broken glyphs with no font embedding + RTL shaping. Rather than
    // producing a broken Arabic PDF, we always generate the checklist in English, which
    // is still fully usable for gathering the right documents.
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const docItems = [...document.querySelectorAll('.vdocs li span[data-en]')].map(el =>
      el.getAttribute('data-en')
    );

    doc.setFontSize(18);
    doc.text('Colonel Tours', 14, 18);
    doc.setFontSize(13);
    doc.text(`${nameEn} Visa — Document Checklist`, 14, 30);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('coloneltours.eg  |  WhatsApp: +20 112 667 2801', 14, 37);
    doc.setDrawColor(212,149,47);
    doc.line(14, 41, 196, 41);

    let y = 52;
    doc.setFontSize(12);
    doc.setTextColor(30);
    docItems.forEach((item) => {
      doc.rect(14, y-4.5, 5, 5);
      doc.text(item, 23, y);
      y += 10;
    });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Generated from coloneltours.eg - contact us for the latest requirements before applying.', 14, 285);

    doc.save(`colonel-tours-${slug}-documents.pdf`);
  };
})();
