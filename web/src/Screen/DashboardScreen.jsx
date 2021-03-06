import React, { useEffect, useState } from "react";
import CardCmp from "../Components/DashBoardCmp/CardCmp";
import NavbarApp from "../Components/DashBoardCmp/Navbar";
import styles from "./Dashboard.module.css";
import axios from "axios";
import { BASE_URI } from "../core";
import SwitchesSize from "../Components/Switch";
import SplashScreen from "../Screen/SplashScreen";
import { io } from "socket.io-client";

const DashboardScreen = () => {
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("data")));
  const [indexNum, setIndexNum] = useState(null);
  const [postSend, setPostSend] = useState(false);
  const [checkHandle, setCheckHandle] = useState(false);
  const [icon, setIcon] = useState("fas fa-sun");
  const [darkTheme, setDarkTheme] = useState(false);
  const [loadIsMore, setLoadIsMore] = useState(false);
  const [post, setPost] = useState([]);
  
  // console.log(checkHandle)
  // console.log("index =>>" ,indexNum)
  // console.log(user);

  useEffect(async () => {
    await axios
      .get(`${BASE_URI}/api/v1/post?page=0`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setPost([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [postSend]);


  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("connect" , function(){
      console.log("connected to server")
    })

    socket.on("disconnect", function(message){
        console.log("disconnected from server" , message)
    })

    socket.on("POST" , function (data){
        console.log("socket data" , data);
        setPost( (prev)=> [data , ...prev]  )
      })
    console.log("useEffect socket");
    
    return () => {
      socket.close()
    }
    

  }, [])

    
  // console.log('post arhi hai , ' + )

  const addPost = async () => {
    const postObj = {
      userName: `${user.firstName} ${user.lastName}`,
      postCapture: inputValue,
      date: new Date().toLocaleDateString(),
      userId: user._id,
      privatePost: checkHandle,
    };
    await axios
      .post(`${BASE_URI}/api/v1/post`, postObj, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setPostSend(!postSend);
    // setPost([
    //   ...post,
    //   {
    //     userName: user.firstName + user.lastName,
    //     postCapture: inputValue,
    //     date: new Date().toLocaleDateString(),
    //     uid: user._id,
    //   },
    // ]);
  };
  const removeValue = () => {
    setInputValue("");
  };

  const editPost = (ind, editValue) => {
    const postKey = {
      uPostId: post[ind]._id,
    };
    console.log(postKey);
    axios
      .put(
        `${BASE_URI}/api/v1/post`,
        { postCap: editValue, uPostId: postKey.uPostId },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("ress", res);
        setPostSend(!postSend);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("edit function" , ind)
    // post[ind].postCapture = editValue
    // post[ind].date = new Date().toLocaleDateString()
    // setPost([...post])
  };

  const deletePost = async (e) => {
    const postKey = {
      uPostId: post[e]._id,
    };
    console.log(postKey);
    await axios
      .delete(`${BASE_URI}/api/v1/post/${postKey.uPostId}`, {
        withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setPostSend(!postSend);

    // console.log("deletePost" , e)
    // post.splice(e , 1)
    // setPost([...post])
  };
  const changeTheme = () => {
    if (!darkTheme) {
      setIcon("fas fa-moon");
      setDarkTheme(true);
    } else {
      setIcon("fas fa-sun");
      setDarkTheme(false);
    }
  };

  const loadMore = () => {
    console.log("l;oad");
    axios
      .get(`${BASE_URI}/api/v1/post?page=${post.length}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.length) {
          const newPosts = [...post, ...res.data];
          setPost(newPosts);
        } else {
          console.log("end hogayi length");
          setLoadIsMore(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className={`w-100 ${styles.dashBoardMainBox}`}
      style={{ backgroundColor: darkTheme ? "#343a40" : "#E0EAFC" }}
    >
      {/* <h1>Dashboard Screen</h1> */}
      <NavbarApp icon={icon} changeTheme={changeTheme} />
      {post.length ? (
        <>
          <div className={`${styles.postSectionBox}`}>
            <div
              className={
                darkTheme
                  ? `${styles.postBox} ${styles.postBoxDark}`
                  : styles.postBox
              }
            >
              <section className={styles.postCardHeading}>
                <p>Create Post</p>
              </section>
              <section className={styles.postInputBox}>
                <textarea
                  cols="30"
                  rows="3"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What's on your mind?"
                  style={{ color: darkTheme ? "white" : "black" }}
                ></textarea>
              </section>
              <section className={styles.postBtns}>
                <SwitchesSize
                  checkHandle={checkHandle}
                  setCheckHandle={setCheckHandle}
                />
                <button
                  onClick={() => removeValue()}
                  className={`btn btn-danger`}
                >
                  Remove
                </button>
                <button onClick={() => addPost()} className={`btn btn-primary`}>
                  POST
                </button>
              </section>
            </div>
          </div>

          <section className="row m-0">
            {post.map((val, ind) => {
              // console.log(val.privatePost)

              return user._id === val.userId ? (
                <div key={ind} className="col-lg-3 col-md-6">
                  <CardCmp
                    name={val.userName}
                    ind={ind}
                    date={val.date}
                    postCap={val.postCapture}
                    indexNum={indexNum}
                    setIndexNum={setIndexNum}
                    editPostFun={editPost}
                    deletePost={deletePost}
                    ownPost={true}
                    privatePost={val.privatePost}
                    darkTheme={darkTheme}
                  />
                </div>
              ) : !val.privatePost ? (
                <div key={ind} className="col-lg-3 col-md-6">
                  <CardCmp
                    name={val.userName}
                    ind={ind}
                    date={val.date}
                    postCap={val.postCapture}
                    indexNum={indexNum}
                    setIndexNum={setIndexNum}
                    editPostFun={editPost}
                    deletePost={deletePost}
                    ownPost={false}
                    privatePost={val.privatePost}
                    darkTheme={darkTheme}
                  />{" "}
                </div>
              ) : null;
            })}
            {!loadIsMore ? (
              <div className={styles.loadMoreBtnBox}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={() => loadMore()}
                >
                  Load More
                </button>
              </div>
            ) : null}
          </section>
        </>
      ) : (
        <SplashScreen />
      )}
    </div>
  );
};

export default DashboardScreen;
