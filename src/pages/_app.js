import { useEffect } from "react";
import "@/styles/globals.css";
import store from "@/reducers/store";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import localFont from "next/font/local";
import {
  getAllBookMark,
  getAllChapters,
  getAllChaptersWithoutUser,
  getAllJuzz,
  getAllLanguages,
  getBismillah,
  getProfile,
} from "@/reducers/apiSlice";
import useWindowSize from "@/utils/mobileDetect";
import Modal from "@/components/Modal";
import MobileAppModal from "@/components/MobileAppModal";
// import { GoogleAnalytics } from "@next/third-parties/google";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "../../next-i18next.config";

// Load Local Fonts
const uthmanicScript = localFont({
  src: "../fonts/usmani-font.woff2",
  display: "swap",
  variable: "--font-uthmanic",
});

const uthmanicAyatIndex = localFont({
  src: "../fonts/KFGQPC_Uthmanic_Script_HAFS_Regular.otf",
  display: "swap",
  variable: "--font-uthmanicAyat",
});

const fontSymbolsV2 = localFont({
  src: "../fonts/Symbols1_Ver02.otf",
  display: "swap",
  variable: "--font-symbols",
});

const futuran = localFont({
  src: "../fonts/futuran.ttf",
  display: "swap",
  variable: "--font-futuran",
});

const qcf2001 = localFont({
  src: "../fonts/QCF2001.ttf",
  display: "swap",
  variable: "--font-qcf2001",
});

const qcf2604 = localFont({
  src: "../fonts/QCF2604.ttf",
  display: "swap",
  variable: "--font-qcf2604",
});

const bismillah = localFont({
  src: "../fonts/bismillahFont.ttf",
  display: "swap",
  variable: "--font-bismillah",
});

const indoPakScript = localFont({
  src: "../fonts/indo-pak.woff2",
  display: "swap",
  variable: "--font-indoPak",
});

const ApiCall = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.api.user);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const FetchData = async () => {
    try {
      await Promise.all([
        dispatch(getBismillah())?.unwrap(),
        dispatch(getAllLanguages())?.unwrap(),
      ]);
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  };

  const FetchChapters = async () => {
    try {
      if (profile?._id) {
        await dispatch(getAllChapters(profile?._id))?.unwrap();
      } else {
        await dispatch(getAllChaptersWithoutUser())?.unwrap();
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  };

  const getBookMark = async () => {
    try {
      if (profile) {
        await Promise.all([
          dispatch(getAllBookMark({ bookMarkType: "ayat" }))?.unwrap(),
          dispatch(getAllBookMark({ bookMarkType: "surah" }))?.unwrap(),
        ]);
      }
    } catch (error) {
      console.log("error in get bookmark");
    }
  };

  const getJuzz = async () => {
    try {
      const res = await dispatch(getAllJuzz())?.unwrap();
      console.log("res=>", res?.data);
    } catch (error) {
      console.log("error in getting juzz", error);
    }
  };

  useEffect(() => {
    FetchData();
    getJuzz();
  }, []);

  useEffect(() => {
    FetchChapters();
  }, [profile]);

  useEffect(() => {
    if (profile) {
      getBookMark();
    }
  }, [profile]);
};

function MyApp({ Component, pageProps }) {
  const screenWidth = useWindowSize();
  const isMobile = screenWidth <= 768;

  // useEffect(() => {
  //   if (isMobile) {
  //     const modalElement = document.getElementById("app-modal");
  //     if (modalElement) {
  //       const modalInstance = new bootstrap.Modal(modalElement);
  //       modalInstance.show();

  //       // Cleanup: Hide modal when component unmounts or isMobile changes
  //       return () => {
  //         modalInstance.hide();
  //       };
  //     }
  //   }
  // }, [isMobile]);

  // const handleModalClose = () => {
  //   const modalElement = document.getElementById("app-modal");
  //   const modalInstance = bootstrap.Modal.getInstance(modalElement);
  //   if (modalInstance) {
  //     modalInstance.hide();
  //   }
  // };

  // useEffect(() => {
  //   const cookieLang = Cookies.get('language') || 'en'; // Default to 'en' if no cookie is set.

  //   // Make sure i18n is initialized and set the language if it's different from the current language
  //   if (i18n.isInitialized && i18n.language !== cookieLang) {
  //     i18n.changeLanguage(cookieLang);
  //   }
  // }, []);

  return (
    <>
      <div
        className={`${uthmanicScript.variable} ${fontSymbolsV2.variable} ${futuran.variable} ${qcf2001.variable} ${qcf2604.variable} ${bismillah.variable} ${indoPakScript.variable}  ${uthmanicAyatIndex.variable}`}
      >
        {" "}
        {/* <GoogleAnalytics gaId="G-LYDJJP72PL" /> */}
        <Provider store={store}>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 1500,
            }}
          />
          {/* <Modal
            id="app-modal"
            type="purple"
            closeModal={handleModalClose}
            hideClose={true}
          >
            <MobileAppModal closeModal={handleModalClose} />
          </Modal> */}
          <ApiCall />

       
          <Component {...pageProps} />
        </Provider>
      </div>
    </>
  );
}

// export default appWithTranslation(MyApp);
export default appWithTranslation(MyApp, nextI18nextConfig);
// export default appWithTranslation(MyApp);