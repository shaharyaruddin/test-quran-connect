import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import {
  changePassword,
  deleteUserAccount,
  editUserDetails,
  forgotPasswordOtp,
  getAllBookMark,
  getAllChapters,
  getAllChaptersWithoutUser,
  getAllJuzz,
  getAllLanguages,
  getBismillah,
  LoginUser,
  LogoutUser,
  memorizeJuzz,
  memorizeSurah,
  setNewPassword,
  SignUpUser,
  unMemorizeJuzz,
  unMemorizeSurah,
  verifyOtp,
} from "./apiSlice";

export const extraReducersBuilder = (builder) => {
  builder

    // LoginUser
    .addCase(LoginUser.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(LoginUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      if (action?.payload?.data?.isVerified) {
        state.user = action.payload.data;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
        axios.defaults.headers.common["Authorization"] = action.payload.data
          .token
          ? `Bearer ${action.payload.data.token}`
          : "";
        Cookies.set("token", action.payload.data.token);
        Cookies.set("loggedInAs", "user");
      }
      toast.success(action.payload.msg);
    })
    .addCase(LoginUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // VerifyToken
    .addCase(verifyOtp.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(verifyOtp.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      if (action.payload.type === "signup") {
        state.user = action.payload.data;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
        axios.defaults.headers.common["Authorization"] = action.payload.data
          .token
          ? `Bearer ${action.payload.data.token}`
          : "";
        Cookies.set("token", action.payload.data.token);
        Cookies.set("loggedInAs", "user");
      }
      toast.success(action.payload.msg);
    })
    .addCase(verifyOtp.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // Signup
    .addCase(SignUpUser.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(SignUpUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      toast.success(action.payload.msg);
    })
    .addCase(SignUpUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // ForgotPassword
    .addCase(forgotPasswordOtp.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(forgotPasswordOtp.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      toast.success(action.payload.msg);
    })
    .addCase(forgotPasswordOtp.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // NewPassword
    .addCase(setNewPassword.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(setNewPassword.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      toast.success(action.payload.msg);
    })
    .addCase(setNewPassword.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // ChangePassword
    .addCase(changePassword.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(changePassword.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      toast.success(action.payload.msg);
    })
    .addCase(changePassword.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // Logout
    .addCase(LogoutUser.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(LogoutUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      localStorage.clear();
      Cookies.remove("token");
      Cookies.remove("loggedInAs");
      state.error = null;
      state.user = null;
      localStorage.setItem("logout", Date.now());
      toast.success(action.payload.message);
    })
    .addCase(LogoutUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      localStorage.clear();
      Cookies.remove("token");
      state.error = null;
      state.user = null;
      localStorage.setItem("logout", Date.now());
      toast.error(action.payload.message);
    })

    //Get Surah Without User
    .addCase(getAllChaptersWithoutUser.pending, (state, action) => {
      state.surahsLoading = "loading";
      state.error = null;
    })
    .addCase(getAllChaptersWithoutUser.fulfilled, (state, action) => {
      state.surahsLoading = "succeeded";
      state.error = null;
      // state.surahs = action?.payload?.data;
      state.surahs = action?.payload?.data?.map((surah) => ({
        ...surah,
        mainName: `${surah.index} - ${surah.name}`,
      }));
    })
    .addCase(getAllChaptersWithoutUser.rejected, (state, action) => {
      state.surahsLoading = "failed";
      state.error = action.payload.msg;
      // toast.error(action.payload.msg);
    })

    //Get Surah With User
    .addCase(getAllChapters.pending, (state, action) => {
      state.surahsLoading = "loading";
      state.error = null;
    })
    .addCase(getAllChapters.fulfilled, (state, action) => {
      state.surahsLoading = "succeeded";
      state.error = null;
      // state.surahs = action?.payload?.data;
      state.surahs = action?.payload?.data?.map((surah) => ({
        ...surah,
        mainName: `${surah.index} - ${surah.name}`,
      }));
    })
    .addCase(getAllChapters.rejected, (state, action) => {
      state.surahsLoading = "failed";
      state.error = action.payload.msg;
      // toast.error(action.payload.msg);
    })

    //Get Juzz
    .addCase(getAllJuzz.pending, (state, action) => {
      state.surahsLoading = "loading";
      state.error = null;
    })
    .addCase(getAllJuzz.fulfilled, (state, action) => {
      state.surahsLoading = "succeeded";
      state.error = null;
      // state.surahs = action?.payload?.data;
      state.juzz = action?.payload?.data?.map((surah) => ({
        ...surah,
        mainName: `${surah.index} - ${surah.name}`,
      }));
    })
    .addCase(getAllJuzz.rejected, (state, action) => {
      state.surahsLoading = "failed";
      state.error = action.payload.msg;
      // toast.error(action.payload.msg);
    })

    //Get Bismillah
    .addCase(getBismillah.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(getBismillah.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.bismillah = action?.payload?.data;
    })
    .addCase(getBismillah.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      // toast.error(action.payload.msg);
    })

    //Get Translation
    .addCase(getAllLanguages.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(getAllLanguages.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.translation = action?.payload?.data;
    })
    .addCase(getAllLanguages.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      // toast.error(action.payload.msg);
    })

    //editUserDetails
    .addCase(editUserDetails.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(editUserDetails.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.user = action.payload.data;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    })
    .addCase(editUserDetails.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    // Delete User
    .addCase(deleteUserAccount.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(deleteUserAccount.fulfilled, (state, action) => {
      state.status = "succeeded";
      localStorage.clear();
      Cookies.remove("token");
      Cookies.remove("loggedInAs");
      state.error = null;
      state.user = null;
      toast.success(action.payload.msg);
    })
    .addCase(deleteUserAccount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      toast.error(action.payload.message);
    })

    //memorizedSurah
    .addCase(memorizeSurah.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(memorizeSurah.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.user = action.payload.data;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    })
    .addCase(memorizeSurah.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    //un-memorizedSurah
    .addCase(unMemorizeSurah.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(unMemorizeSurah.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.user = action.payload.data;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    })
    .addCase(unMemorizeSurah.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

     //memorizedJuzz
    .addCase(memorizeJuzz.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(memorizeJuzz.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.user = action.payload.data;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    })
    .addCase(memorizeJuzz.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    //un-memorizedJuzz
    .addCase(unMemorizeJuzz.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(unMemorizeJuzz.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.user = action.payload.data;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    })
    .addCase(unMemorizeJuzz.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      toast.error(action.payload.msg);
    })

    //bookMark
    .addCase(getAllBookMark.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(getAllBookMark.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      if (action.payload.bookMarkType === "ayat") {
        state.bookMarkAyah = action?.payload?.data;
      }
      if (action.payload.bookMarkType === "surah") {
        state.bookMarkSurah = action?.payload?.data;
      }
    })
    .addCase(getAllBookMark.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.msg;
      // toast.error(action.payload.msg);
    });
};
