import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { extraReducersBuilder } from "./apiReducer";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { scripts } from "@/utils/helper";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APPAPIURL;

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

export const handleUnauthorizedError = () => {
  localStorage.clear();
  Cookies.remove("token");
  localStorage.setItem("logout", Date.now());
  window.location.href = "/";
};

const initialState = {
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  user: null,
  token: Cookies.get("token") || null,
  bismillah: 0,
  method: "arabic",
  currentSurah: null,
  surahs: [],
  juzz: [],
  translation: [],
  surahsLoading: null,
  scripts: scripts,
  bookMarkAyah: [],
  bookMarkSurah: [],
  isModalOpen: false
};

export const fetchToken = createAsyncThunk(
  "member/fetchToken",
  async (bodyData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("user");
      if (token) {
        const user = await JSON.parse(token);
        return user;
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const LoginUser = createAsyncThunk(
  "auth/login",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/login`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getUser = createAsyncThunk(
  "auth/me",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${bodyData?.path}/me`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const AddContactMessage = createAsyncThunk(
  "contact/add",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`contact/add`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const verifyOtp = createAsyncThunk(
  "auth/verify-otp",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/verify-otp`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const ForgetUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`user/forgotPassword`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const SignUpUser = createAsyncThunk(
  "auth/register",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/register`, bodyData);
      return response?.data;
    } catch (error) {
      console.log("error of api res", error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const SignUpGuestUser = createAsyncThunk(
  "guest/register",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`guest/register`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const LogoutUser = createAsyncThunk(
  "auth/logout",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/logout`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllChapters = createAsyncThunk(
  "chapter/all",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`chapter/all`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllChaptersWithoutUser = createAsyncThunk(
  "chapter/allGuest",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`chapter/allGuest`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getBismillah = createAsyncThunk(
  "bismillah/",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`bismillah/`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getChaptersLesson = createAsyncThunk(
  "lesson/chapter",
  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.get(`lesson/chapter/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getWordsBySurah = createAsyncThunk(
  "word/surah",

  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.get(`word/surah/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
// export const getWordsByJuzz = createAsyncThunk(
//   "word/juzz",
//   async (bodyData, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`word/words/get-words-by-juzz`, {
//         params: bodyData,
//       });
//       return response?.data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );
export const getWordsByJuzz = createAsyncThunk(
  "word/juzz",
  async ({ payload, signal }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`word/words/get-words-by-juzz`, {
        params: payload,
        signal, // <- Attach AbortSignal here
      });
      return response?.data;
    } catch (error) {
      // If request was canceled
      if (axios.isCancel(error) || error.name === "CanceledError") {
        console.log("Request was cancelled");
        return;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const addTest = createAsyncThunk(
  "test/add",
  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.post(`test/add`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const forgotPasswordOtp = createAsyncThunk(
  "auth/forgot",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/forgot`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const setNewPassword = createAsyncThunk(
  "auth/newPassword",
  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.post(`auth/newPassword`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.post(`auth/changePassword`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllLanguages = createAsyncThunk(
  "lang/all",

  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.get(`lang/all`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getChaptersRunningTranslation = createAsyncThunk(
  "runningTranslation/surah",
  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("fetching lesson...", bodyData);
      const response = await axios.get(
        `runningTranslation/surah/${bodyData?.chapterId}/${bodyData?.languageId}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getSurahDetails = createAsyncThunk(
  "chapter/chapterById",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`chapter/chapterById/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getSurahDetailsGuest = createAsyncThunk(
  "chapter/chapterByIdGuest",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`chapter/chapterByIdGuest/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const memorizeSurah = createAsyncThunk(
  "chapter/memorize",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`chapter/memorize/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const memorizeJuzz = createAsyncThunk(
  "juzz/memorize",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`juzz/memorize/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const addBookMarkAyat = createAsyncThunk(
  "add/bookmark",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`bookmark/add-bookmark`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllBookMark = createAsyncThunk(
  "get/bookmark",
  async ({ bookMarkType }, { rejectWithValue }) => {
    try {
      const response = await axios.get("bookmark/get-bookmark", {
        params: {
          bookMarkType,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const deleteBookMark = createAsyncThunk(
  "delete/bookmark",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`bookmark/delete-bookmark`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllJuzz = createAsyncThunk(
  "get/allJuzz",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`juzz/all`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getJuzzByAyat = createAsyncThunk(
  "get/juzzByAyat",
  async ({ id, languageId, type }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`juzz/juzzById`, {
        params: {
          id,
          languageId,
          type
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const incrementUserCoins = createAsyncThunk(
  "auth/increment-coins",
  async (bodyData, { rejectWithValue }) => {
    try {
      console.log("bodyData", bodyData);

      const response = await axios.post(
        `${bodyData?.route}/increment-coins`,
        bodyData
      );
      return response?.data;
    } catch (error) {
      console.log("error of api res", error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const unlockSurah = createAsyncThunk(
  "auth/unlock-surah",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${bodyData?.route}/unlock-surah`,
        bodyData
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const authenticateUser = createAsyncThunk(
  "auth/me",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`auth/me`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const editUserDetails = createAsyncThunk(
  "auth/edit",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/edit`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const deleteUserAccount = createAsyncThunk(
  "auth/delete",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`auth/delete`, bodyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const unMemorizeSurah = createAsyncThunk(
  "chapter/unMemorize",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`chapter/unMemorize/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const unMemorizeJuzz = createAsyncThunk(
  "juzz/unMemorize",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`juzz/unMemorize/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllReciter = createAsyncThunk(
  "get/allReciter",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`admin/get-reciter`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getBookMarkAyatsById = createAsyncThunk(
  "get/allReciter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`bookmark/bookmarked-ayat-list`, {
        params: {
          id,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const subscribeUser = createAsyncThunk(
  "auth/subscribe",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${bodyData?.route}/subscribe`,
        bodyData
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const addCustomerInfo = createAsyncThunk(
  "auth/addCustomerInfo",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${bodyData?.route}/addCustomerInfo`,
        bodyData
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAyats = createAsyncThunk(
  "ayat/surah",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`ayat/surah/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getInfo = createAsyncThunk(
  "auth/getInfo",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`auth/getInfo`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getChapterQuizDetails = createAsyncThunk(
  "quizQuestion/all",
  async (bodyData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`quizQuestion/all/${bodyData}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setScripts: (state, action) => {
      state.scripts = action.payload;
    },
    setIsModalOpen : (state, action)=>{
      state.isModalOpen = action.payload
    }
  },
  extraReducers: (builder) => {
    extraReducersBuilder(builder);
  },
});

export const { setUser, setScripts, setIsModalOpen } = apiSlice.actions;

export const getProfile = () => (dispatch) => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    dispatch(setUser(user));
    axios.defaults.headers.common["Authorization"] = user?.token
      ? `Bearer ${user.token}`
      : "";
  }
};

export const signOut = () => {
  return new Promise((resolve) => {
    localStorage.removeItem("user");
    localStorage.removeItem("school");
    Cookies.remove("token");
    setUser("");
    setSchool("");
    toast.success("You have successfully signed out.");
    resolve();
  });
};

export default apiSlice.reducer;
