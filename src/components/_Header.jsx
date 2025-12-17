import { useEffect, useState } from "react";
import IconBadge from "./IconBadge";
import Link from "next/link";
import Modal from "./Modal";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import Button from "./Button";
import Otp from "./auth/Otp";
import NewPassword from "./auth/NewPassword";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, LogoutUser, setIsModalOpen } from "@/reducers/apiSlice";
import { Bookmark, Facebook, Instagram } from "lucide-react";
import HeaderButtonModal from "./HeaderButtonModal";
import ProfileDetails from "./auth/ProfileDetails";
import DeleteAccount from "./auth/DeleteAccount";
import BookMarkModal from "./BookMarkModal";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useRouter } from "next/router";

const Header = ({ iconSize, currentTab }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [modalType, setModalType] = useState("");
  const [path, setPath] = useState("");
  const [data, setData] = useState(null);
  const profile = useSelector((state) => state.api.user);
  const surahs = useSelector((state) => state.api.surahs);
  const bookmarkAyah = useSelector((state) => state.api.bookMarkAyah)?.length;
  const bookmarkSurah = useSelector((state) => state.api.bookMarkSurah)?.length;
  const bookmarkCount = bookmarkAyah + bookmarkSurah;
  const dispatch = useDispatch();

  // Add stars count
  const surahsStarsAdd = surahs.reduce(
    (sum, surah) => sum + (surah?.star || 0),
    0
  );

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleModalOpen = (type, path) => {
    setModalType(type);
    if (path) {
      setPath(path);
    }
    dispatch(setIsModalOpen(true));

    const modalElement = document.getElementById("authModal");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const handleModalOpen2 = (type, path) => {
    setModalType(type);
    if (path) {
      setPath(path);
    }

    const modalElement = document.getElementById("authModal2");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const handleModalType = (type, path, data) => {
    setModalType(type);
    if (path) {
      setPath(path);
    }
    if (data) {
      setData(data);
    }
  };

  const handleModalClose = () => {
    const modalElement = document.getElementById("authModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    // Remove lingering backdrop manually as a fix
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }

    // Remove 'modal-open' class from body manually
    document.body.classList.remove("modal-open");
    dispatch(setIsModalOpen(false));
    setModalType(""); // Reset modal type after closing
    setPath("");
  };

  const handleModalClose2 = () => {
    const modalElement = document.getElementById("authModal2");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    // Remove lingering backdrop manually as a fix
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }

    // Remove 'modal-open' class from body manually
    document.body.classList.remove("modal-open");
    setModalType(""); // Reset modal type after closing
    setPath("");
  };

  const handleModalOpen3 = (type, path) => {
    const offerQuoteModalElement = document.getElementById("authModal");
    const offerQuoteModalInstance = bootstrap.Modal.getInstance(
      offerQuoteModalElement
    );
    if (offerQuoteModalInstance) {
      offerQuoteModalInstance.hide();
    }
    setModalType(type);
    if (path) {
      setPath(path);
    }

    const modalElement = document.getElementById("authModal3");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  };
  const handleModalClose3 = () => {
    const modalElement = document.getElementById("authModal3");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    // Remove lingering backdrop manually as a fix
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }

    // Remove 'modal-open' class from body manually
    document.body.classList.remove("modal-open");
    setModalType(""); // Reset modal type after closing
    setPath("");
  };

  const logout = async () => {
    try {
      const response = await dispatch(LogoutUser()).unwrap();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link
              href="/"
              className={`${
                !iconSize ? "navbar-brand " : "navbar-brand2"
              } d-lg-none`}
            >
              <img
                src="/images/my-quran-journey-logo.png"
                className="img-fluid"
                alt="Logo"
              />
            </Link>
            <button
              className="btn btn-primary navbar-toggler rounded-5 p-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarScroll"
              aria-controls="navbarScroll"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span>
                {" "}
                <i className="far fa-bars text-light"></i>
              </span>
            </button>

            <div
              className="navbar-collapse collapse text-center"
              id="navbarScroll"
            >
              <ul className="navbar-nav me-auto my-2 my-lg-0">
                <li className="nav-item">
                  <Link
                    target="blank"
                    href="https://www.instagram.com/myquranjourneyapp/"
                    className="btn btn-warning m-2"
                  >
                    <span>
                      <Instagram strokeWidth={2} />
                    </span>
                  </Link>
                  <Link
                    target="blank"
                    href="https://www.facebook.com/myquranjourneyapp"
                    className="btn btn-warning m-2"
                  >
                    <span>
                      <Facebook fill="white" strokeWidth={1} />
                    </span>
                  </Link>
                  <IconBadge
                    icon="/images/icon-page.png"
                    count={
                      profile
                        ? surahs?.filter((chap) => Boolean(chap?.isTestTaken))
                            ?.length
                        : 0
                    }
                    onClick={() => handleModalOpen2("surahs", "header")}
                  />
                  <IconBadge
                    icon="/images/icon-star.png"
                    count={profile ? surahsStarsAdd : 0}
                    onClick={() => handleModalOpen2("stars", "header")}
                  />
                  <IconBadge
                    icon="/images/icon-heart.png"
                    count={
                      profile
                        ? router?.pathname?.includes("surah") ||
                          currentTab === "surahs"
                          ? profile?.memorizedSurahs?.length
                          : router?.pathname?.includes("juzz") ||
                            currentTab === "juzz"
                          ? profile?.memorizedJuzz?.length
                          : profile?.memorizedSurahs?.length +
                            profile?.memorizedJuzz?.length
                        : 0
                    }
                    onClick={() => handleModalOpen2("memorized", "header")}
                  />
                  {profile && (
                    <IconBadge
                      icon2={<Bookmark size={26} fill="#e5ce2c" />}
                      count={bookmarkCount || 0}
                      onClick={() => handleModalOpen("bookmarkedItems")}
                    />
                  )}
                </li>
              </ul>
              <Link
                className={`${
                  !iconSize ? "navbar-brand" : "navbar-brand2"
                } d-none d-md-block`}
                href="/"
              >
                <img
                  src="/images/my-quran-journey-logo.png"
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <ul className="navbar-nav ms-auto my-2 my-lg-0 justify-content-end ">
                <LanguageSwitcher />
                {!profile ? (
                  <li className="nav-item">
                    <Button
                      variant="primary"
                      text={t("Login")}
                      onClick={() => handleModalOpen("login", "header")}
                    />
                    <Button
                      variant="primary"
                      text={t("Signup")}
                      onClick={() => handleModalOpen("signup", "header")}
                    />
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Button
                        variant="primary"
                        text={t("Settings")}
                        onClick={() =>
                          handleModalOpen("profile-details", "header")
                        }
                      />
                    </li>
                    <li className="nav-item">
                      <Button
                        variant="primary"
                        text={t("Logout")}
                        onClick={logout}
                      />
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Link
                    href="https://sidr.productions/support-our-work/"
                    className="btn btn-warning m-2"
                  >
                    <span>{t("SupportUs")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <Modal
        title={
          modalType === "login"
            ? t("Login")
            : modalType === "signup"
            ? t("CreateAccount")
            : modalType === "forgot-password"
            ? t("ForgotPassword")
            : modalType === "otp"
            ? t("EnterOTP")
            : modalType === "new-password"
            ? t("NewPassword")
            : modalType === "profile-details"
            ? t("ProfileDetails")
            : ""
        }
        description={
          modalType === "login"
            ? t("LoginText")
            : modalType === "signup"
            ? t("CreateAccountText")
            : modalType === "forgot-password"
            ? t("ForgotPasswordText")
            : modalType === "otp"
            ? t("OTPText")
            : modalType === "new-password"
            ? t("NewPasswordText")
            : modalType === "profile-details"
            ? t("ProfileDetailsText")
            : ""
        }
        closeModal={handleModalClose}
        id="authModal"
      >
        {modalType === "login" && (
          <Login
            handleModalType={handleModalType}
            path={path}
            closeModal={handleModalClose}
            data={data}
          />
        )}
        {modalType === "signup" && (
          <Signup
            handleModalType={handleModalType}
            path={path}
            closeModal={handleModalClose}
            data={data}
          />
        )}
        {modalType === "forgot-password" && (
          <ForgotPassword
            handleModalType={handleModalType}
            path={path}
            closeModal={handleModalClose}
            data={data}
          />
        )}
        {modalType === "otp" && (
          <Otp
            handleModalType={handleModalType}
            path={path}
            closeModal={handleModalClose}
            data={data}
          />
        )}
        {modalType === "new-password" && (
          <NewPassword
            handleModalType={handleModalType}
            path={path}
            closeModal={handleModalClose}
            data={data}
          />
        )}
        {modalType === "profile-details" && (
          <ProfileDetails
            handleModalType={handleModalType}
            closeModal={handleModalClose}
            openDeleteModal={handleModalOpen3}
            profile={profile}
          />
        )}
        {modalType === "bookmarkedItems" && (
          <BookMarkModal
            closeModal={handleModalClose}
            handleModalType={handleModalType}
          />
        )}
      </Modal>
      <Modal hideClose={true} type="purple" id="authModal2">
        {modalType === "surahs" && (
          <HeaderButtonModal
            title={t("CompletedSurahs")}
            description={t("CompletedSurahsText")}
            imagePath="/images/mqj-surahs-icon.svg"
            closeModal={handleModalClose2}
          />
        )}
        {modalType === "memorized" && (
          <HeaderButtonModal
            title={
              router?.pathname?.includes("surah") || currentTab === "surahs"
                ? t("MemorizedSurahs")
                : t("MemorizedJuz")
            }
            description={
              router?.pathname?.includes("surah") || currentTab === "surahs"
                ? t("MemorizedSurahsText")
                : t("MemorizedJuzzText")
            }
            imagePath="/images/mqj-heart.svg"
            closeModal={handleModalClose2}
          />
        )}
        {modalType === "stars" && (
          <HeaderButtonModal
            title={t("StarsEarned")}
            description={t("StarsEarnedText")}
            imagePath="/images/mqj-star-icon.svg"
            closeModal={handleModalClose2}
          />
        )}
        {modalType === "bookmarked" && (
          <HeaderButtonModal
            title={t("MemorizedSurahs")}
            description={t("MemorizedSurahsText")}
            imagePath="/images/mqj-heart.svg"
            closeModal={handleModalClose2}
          />
        )}
      </Modal>
      <Modal hideClose={true} type="purple" id="authModal3">
        {modalType === "delete-account" && (
          <DeleteAccount closeModal={handleModalClose3} />
        )}
      </Modal>
    </>
  );
};

export default Header;
