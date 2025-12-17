const ArabicWordsCard = ({
  ayahWordArabic,
  ayahWordEnglish,
  fontSize,
  script,
  ayahNumber
}) => {
  const minFontSize = 10; // Minimum font size in pixels
  const maxFontSize = 50; // Maximum font size in pixels
  const sizeAdjustment = 5; // Add 5px to make it bigger

  // Calculate font size based on slider value, plus adjustment
  let calculatedFontSize =
    minFontSize +
    (maxFontSize - minFontSize) * (fontSize / 100) +
    sizeAdjustment;

  const translationFontSize = calculatedFontSize / 2;
  if (script === "67fde5c131fdd14db9aa6836") {
    calculatedFontSize = calculatedFontSize * 0.8; // Reduce font size by 30% for English
  }
  return (
    <div class="bg-white rounded-lg px-3 py-3 text-center">
      <div class="card-body">
        <div
          className={`${
            script === "67fde5c131fdd14db9aa6836" ? "" : script === "67ff8621845b885742c9fa48"
            ? "font-IndoPak"
            : "font-UthmanicScript"
          }`}
          style={{ fontSize: `${calculatedFontSize}px` }}
        >
          {ayahWordArabic} <span className="font-UthmanicAyat">{ayahNumber}</span>
        </div>
        <div style={{ fontSize: `${translationFontSize}px` }}>
          {ayahWordEnglish}
        </div>
      </div>
    </div>
  );
};

export default ArabicWordsCard;
