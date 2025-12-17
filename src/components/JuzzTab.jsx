import { getAllJuzz, getJuzzByAyat } from "@/reducers/apiSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const JuzzTab = () => {
  const dispatch = useDispatch();
  const [juzz, setJuzz] = useState([]);

  const getJuzz = async () => {
    try {
      const res = await dispatch(getAllJuzz())?.unwrap();
      console.log("res=>", res?.data);
      setJuzz(res?.data)
    } catch (error) {
      console.log("error in getting juzz", error);
    }
  };
  //   const getJuzzBy = async () => {
  //     try {
  //         const payload = {
  //             id : '6808e06b1a651866511534d2',
  //             languageId: '668ee3b5f5069cf20aa046f9',
  //         }
  //       const res = await dispatch(getJuzzByAyat(payload))?.unwrap();
  //       console.log("res=>", res);
  //     } catch (error) {
  //       console.log("error in getting juzz", error);
  //     }
  //   };

  useEffect(() => {
    getJuzz();
    // getJuzzBy()
  }, []);
  return (
    <div>
      <h1>THis is JUzz Tab</h1>
    </div>
  );
};

export default JuzzTab;
