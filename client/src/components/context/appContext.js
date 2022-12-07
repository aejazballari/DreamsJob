import { createContext, useContext, useReducer } from "react";
import reducer from "./reducer";
import {
  CLEART_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESSS,
  CREATE_JOB_ERROR,
  GET_JOB_BEGIN,
  GET_JOB_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_ERROR,
  EDIT_JOB_SUCCESS,
  SHOW_STATS_SUCCESS,
  SHOW_STATS_BEGIN,
  CLEAR_FILTERS,
  CHANGE_PAGE,
} from "./action";
import axios from "axios";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const location = localStorage.getItem("location");

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token || null,
  userLocation: location || "",
  showSidebar: false,
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "declined"],
  status: "pending",
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobLocation: location || "",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplication: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "http://localhost:4000/api/v1",
  });

  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response);
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEART_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, location, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("location", location);
    localStorage.setItem("token", token);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("location");
    localStorage.removeItem("token");
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/register",
        currentUser
      );
      const { user, location, token } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage(currentUser);
    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    try {
      dispatch({ type: LOGIN_USER_BEGIN });
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        currentUser
      );
      const { token, user, location } = response.data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage(response.data);
    } catch (error) {
      dispatch({ type: LOGIN_USER_ERROR, payload: error.response.data.msg });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateuser", currentUser);
      const { token, user, location } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { token, user, location },
      });
      addUserToLocalStorage({ user, location, token });
    } catch (error) {
      console.log(error.message);
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleInputChange = (name, value) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESSS });
      // dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOB_BEGIN });
    try {
      const { data } = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOB_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (error) {
      console.log(error.response);
      // logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    console.log(`edit job ${id}`);
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, status, jobType, jobLocation, editJobId } =
        state;
      await authFetch.patch(`/jobs/${editJobId}`, {
        position,
        company,
        status,
        jobType,
        jobLocation,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.reponse.data.msg },
      });
    }
    clearAlert();
  };

  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN, payload: { id } });
    try {
      await authFetch.delete(`/jobs/${id}`);
      getJobs();
    } catch (error) {
      // console.log(error);
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get(`/jobs/stats`);
      console.log(data);
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.stats,
          monthlyApplication: data.monthlyApplications,
        },
      });
    } catch (error) {
      // console.log(error);
      logoutUser();
    }
    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleInputChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
