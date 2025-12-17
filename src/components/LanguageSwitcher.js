// // components/LanguageSwitcher.js
// import { useRouter } from "next/router";
// import Button from "./Button";
// import { Globe } from "lucide-react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import i18n from "i18next";
// import Cookies from "js-cookie";

// export default function LanguageSwitcher() {
//   const router = useRouter();
//   const translation = useSelector((state) => state.api.translation);
//   const [language, setLanguage] = useState("en");

//   // const changeLanguage = (lang) => {
//   //     Cookies.set('language', lang, { path: '/' });
//   //     i18n.changeLanguage(lang);
//   //     router.reload(); // You can also use router.push(router.asPath) instead if needed
//   // };
//   const handleLanguageChange = async (lang) => {
//     try {
//       // Set the language in cookies
//       Cookies.set("language", lang);

//       // Change the language in i18n
//       await i18n.changeLanguage(lang);

//       // Optionally, reload the page to apply translations
//       // window.location.reload(); // Uncomment if needed
//     } catch (error) {
//       console.error("Error changing language:", error);
//     }
//   };

//   return (
//     <>
//       {/* <select onChange={handleChange} defaultValue="">
//       <option value="" disabled>{'Select Language'}</option>
//       <option value="en">English</option>
//       <option value="ms">Malay</option>
//     </select> */}
//       <div class="dropdown">
//         <button
//           class="btn btn-warning m-2"
//           type="button"
//           data-bs-toggle="dropdown"
//           aria-expanded="false"
//         >
//           <span>
//             <Globe stroke="white" strokeWidth={1} />
//           </span>
//         </button>
//         <ul class="dropdown-menu">
//           {translation?.map((data, i) => (
//             <li key={i}>
//               <a
//                 className="dropdown-item cursor-pointer"
//                 onClick={() => handleLanguageChange(data?.code)}
//               >
//                 {data?.name}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }
import { useRouter } from "next/router"; // For Pages Router
// OR import { useRouter } from 'next/navigation'; // For App Router
import { Globe } from "lucide-react";
import { useSelector } from "react-redux";
import i18n from "../lib/i18n"; // Import i18n instance
import Cookies from "js-cookie";

export default function LanguageSwitcher() {
  const router = useRouter();
  const translation = useSelector((state) => state.api.translation); // Array of { code, name }

  const handleLanguageChange = async (lang) => {
    try {
      // Set the language in cookies
      Cookies.set("language", lang, { path: "/", expires: 365 });

      // Change the language in i18next
      await i18n.changeLanguage(lang);

      // Update the URL to reflect the new locale
      // For Pages Router
      Cookies.set("language", lang, { path: "/", expires: 365 });
      await i18n.changeLanguage(lang);
      router.replace(router.asPath); // Don't add locale

      // For App Router, use:
      // router.push(`/${lang}${router.asPath}`);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-warning m-2"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span>
          <Globe stroke="white" strokeWidth={1} />
        </span>
      </button>
      <ul className="dropdown-menu">
        {translation
          ?.filter((item) => item?.direction === "ltr")
          ?.map((data, i) => (
            <li key={i}>
              <a
                dir="rtl"
                className="dropdown-item cursor-pointer"
                onClick={() => handleLanguageChange(data?.code)}
              >
                {data?.name}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
