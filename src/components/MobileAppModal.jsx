import React from "react";
import Button from "./Button";

const MobileAppModal = ({ closeModal }) => {
  const redirectToMobileApp = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMobile = isAndroid || isIOS;

    // App-specific details
    const appScheme = "myquranjourney://"; // Custom scheme (update if different)
    const androidPackage = "com.myquranjourney.app";
    const iosAppId = "6503681752";
    const androidStoreUrl =
      "https://play.google.com/store/apps/details?id=com.myquranjourney.app&hl=en";
    const iosStoreUrl = `https://apps.apple.com/app/id${iosAppId}`;
    // Comment out Universal Link unless properly configured
    // const universalLink = "https://myquranjourney.com/app";

    const attemptAppOpen = (appUrl, storeUrl, isIOS = false) => {
      const startTime = Date.now();

      if (isIOS) {
        // Try custom scheme first (since Universal Link isn’t working)
        window.location.href = appScheme;

        // Fallback to App Store if app isn’t installed
        setTimeout(() => {
          if (document.hasFocus()) {
            window.location.href = storeUrl;
          }
        }, 1000); // Give the app time to launch

        // Note: Add Universal Link logic back once configured
        // window.location.href = universalLink;
        // setTimeout(() => {
        //   if (document.hasFocus()) {
        //     window.location.href = appScheme;
        //     setTimeout(() => {
        //       if (document.hasFocus()) {
        //         window.location.href = storeUrl;
        //       }
        //     }, 1000);
        //   }
        // }, 500);
      } else if (isAndroid) {
        window.location.href = appUrl;

        setTimeout(() => {
          if (document.hasFocus()) {
            window.location.href = storeUrl;
          }
        }, 1500);
      }
    };

    if (isMobile) {
      try {
        if (isAndroid) {
          attemptAppOpen(
            `intent://open#Intent;package=${androidPackage};scheme=myquranjourney;end`,
            androidStoreUrl
          );
        } else if (isIOS) {
          attemptAppOpen(appScheme, iosStoreUrl, true);
        }
      } catch (error) {
        console.error("Error redirecting to app:", error);
        window.location.href = isAndroid ? androidStoreUrl : iosStoreUrl;
      }
    } else {
      console.log("Not a mobile device, no redirect triggered.");
    }
  };
  return (
    <>
      <div className="position-relative py-5 px-0 w-100">
        <div
          className="position-absolute"
          style={{
            bottom: "98%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/images/mqj-info-icon.svg"
            className="img-fluid"
            alt="Star Icon"
            width={100}
          />
        </div>
        <p className="text-white fs-3 text-center">
          For better experience, download My Quran Journey from Play Store
        </p>
      </div>
      <div
        className="d-flex position-absolute justify-content-between gap-3"
        style={{ bottom: "-40px", right: 0, left: 0 }}
      >
        <Button variant="primary" onClick={redirectToMobileApp}>
          Continue on Mobile App
        </Button>
        <Button variant="warning" onClick={() => closeModal()}>
          No Thanks
        </Button>
      </div>
    </>
  );
};

export default MobileAppModal;
