export const toArabicNumber = (num) => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return (num ?? 0)
    .toString()
    .split("")
    .map((digit) => arabicDigits[digit])
    .join("");
};

export const scripts = [
  {
    _id: "67fde59231fdd14db9aa6834",
    name: "Usmania",
    rtl: true,
  },
  {
    _id: "67fde5c131fdd14db9aa6836",
    name: "English",
    rtl: false,
  },
  {
    _id: "67ff8621845b885742c9fa48",
    name: "Indo-Pak",
    rtl: true,
  },
];

export const textBasedOnLanguage = (data, lang) => {
  const languageTranslation = data?.translations?.find(
    (item) => item.language?.code === lang
  );
  return languageTranslation?.text;
};


export const textBasedOnLanguageForJuzz = (translations, lang) => {
  const match = translations?.translations?.find(
    (item) => item.language?._id === lang
  );
  return match?.text;
};

export const textBasedOnScript = (data, script) => {
  const scriptText = data?.scripts?.find((item) => item?.scriptId === script);
  return scriptText?.text;
};

export const textBasedOnScriptForAyat = (data, script) => {
  const scriptAyah = data?.scripts?.find(
    (item) => item?.scriptId?._id === script
  );
  return scriptAyah?.text;
};
