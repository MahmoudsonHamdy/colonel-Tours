/* ══════════════════════════════════════════════════════════════
   COLONEL TOURS — أحدث التحديثات (Latest Updates)
   ══════════════════════════════════════════════════════════════

   إزاي تضيف تحديث جديد؟ (How to add a new update — NO CODING NEEDED)

   1. افتح الملف ده بأي برنامج نصوص بسيط (Notepad / TextEdit / حتى في المتصفح).
   2. انسخ أي "بلوك" كامل من اللي تحت (من { لحد })، والصقه فوق كل البلوكات
      التانية (أول عنصر في القائمة = أحدث تحديث يظهر في الموقع).
   3. غيّر القيم جوه علامات الاقتباس " " بس، وسيب باقي الشكل زي ما هو.
   4. احفظ الملف وارفعه على السيرفر بنفس الاسم (assets/updates-data.js).

   الحقول:
   - id:        اسم فريد للتحديث بالإنجليزي وخط فاصل بس، زي "turkey-fee-update-2026"
                (استخدمه لمرة واحدة بس، ميتكررش)
   - date:      التاريخ بصيغة "YYYY-MM-DD" زي "2026-09-15"
   - category:  واحدة من دول بالظبط: "update" أو "offer" أو "new-country" أو "policy"
                (بيتحكم في اللون والتصنيف اللي بيظهر فوق الكارت)
   - title_ar / title_en:  عنوان التحديث بالعربي والإنجليزي
   - body_ar / body_en:    فقرة قصيرة (2-3 جمل) تشرح التحديث
   - link:      (اختياري) رابط لصفحة التأشيرة المرتبطة، زي "visas/turkey.html"
                لو مفيش رابط مرتبط، خليها فاضية: ""
   ══════════════════════════════════════════════════════════════ */

window.UPDATES_DATA = [
  {
    id: "example-update-1",
    date: "2026-09-01",
    category: "update",
    title_ar: "تحديث مدة تنفيذ تأشيرة تركيا",
    title_en: "Turkey Visa Processing Time Update",
    body_ar: "تحديث بيانات المعالجة الخاصة بتأشيرة تركيا — تواصل معنا للتفاصيل الحالية.",
    body_en: "Updated processing details for the Turkey visa — contact us for current specifics.",
    link: "visas/turkey.html"
  },
  {
    id: "example-offer-1",
    date: "2026-08-20",
    category: "offer",
    title_ar: "عرض خاص على تأشيرات دول الخليج",
    title_en: "Special Offer on Gulf Country Visas",
    body_ar: "عرض لفترة محدودة على رسوم الخدمة لمجموعة مختارة من الوجهات. تواصل معنا على واتساب للتفاصيل.",
    body_en: "Limited-time offer on service fees for a selection of destinations. Contact us on WhatsApp for details.",
    link: ""
  }
];

/* ملحوظة: العنصرين اللي فوق دول مجرد أمثلة — احذفهم واستبدلهم بتحديثاتكم الحقيقية. */
