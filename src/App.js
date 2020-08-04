import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";

import Header from "./Header";
import { db } from "./firebase";
import ImageUpload from "./ImageUpload";
import { Input, Modal, Button, makeStyles } from "@material-ui/core";
import { auth } from "./firebase";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // USEEFFECT FOR AUTHENTICATION LISTENER
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //  user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //  user has logged out
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup action before refire the useEffect
      unsubscribe();
    };
  }, [user, username]);

  // USER AUTHENTICATION

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  // CONNECTING WITH THE DATABASE
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="app">
      <div className="app_header">
        <Header />

        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <form className="login__formsignup">
              <center>
                <img
                  className="login__headerModalLogo"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Instragram"
                />
              </center>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signUp}>
                {" "}
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="login__formsignup">
              <center>
                <img
                  className="login__headerModalLogo"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Instragram"
                />
              </center>

              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Modal>

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="login_container">
            <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
            <Button onClick={handleOpen}> Sign Up </Button>
          </div>
        )}
      </div>

      <div className="app__post">
        <div className="app_postleft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              avatar={post.avatar}
              username={post.username}
              imageUrl={post.imageUrl}
              caption={post.caption}
            />
          ))}

          <div className="app_imageupload">
            {user?.displayName ? (
              <ImageUpload username={user.displayName} />
            ) : (
              <h3> Sorry you need to login to upload</h3>
            )}
          </div>
        </div>
        <div className="app_postright">
          <InstagramEmbed
            url="https://www.instagram.com/p/B9LdI2xgxHF/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
