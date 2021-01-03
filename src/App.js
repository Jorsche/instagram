import './App.css';
import React, {useEffect, useState} from 'react';
import Post from "./Post";
import {db,auth} from './firebase';
import {makeStyles} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import igLogo from './assets/ig-logo.png'
import ImageUpload from "./ImageUpload";

function App() {

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
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));
    const [user, setUser]=useState(null);
    const [openSignIn, setOpenSignIn]=useState(false );
    const [username, setUsername]= useState("");
    const classes =  useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [posts,setPosts]=useState([]);
    const [open, setOpen]= useState(false);
    const [password, setPassword]= useState("");
    const [email, setEmail]= useState("");
    const signUp=e=>{
     e.preventDefault();
     auth.createUserWithEmailAndPassword(email,password)
         .then((authUser)=>{
             return authUser.user.updateProfile({displayName:username})
         })
         .catch(err=>alert(err.message));
     setOpen(false);
}
    const signIn=e=>{
     e.preventDefault();
     auth.signInWithEmailAndPassword(email,password)
         .catch(err=>alert(err.message));
     setOpenSignIn(false);
}
    useEffect(()=>{
        const unsub=auth.onAuthStateChanged((authUser)=>{
        if(authUser){
console.log(authUser);
setUser(authUser);
if(authUser.displayName){}
        }
        else{
setUser(null);
        }
        return ()=>{
            unsub();}
    })},[username,user]);
    useEffect(()=>{db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot =>
    setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post: doc.data()
    }) )))},[]);

    return (
    <div className="App">
        <Modal
            open={open}
            onClose={()=>{setOpen(false)}}
        >
            <div style={modalStyle} className={classes.paper}>
            <form className={"app__signup"}>
                <img className={"app__headerImage"}/>
                <Input
                placeholder={"username"}
                type={"username"}
                value={username}
                onChange={(e)=>{
                    setUsername(e.target.value)}}
                />
                <Input
                placeholder={"email"}
                type={"text"}
                value={email}
                onChange={(e)=>{
                    setEmail(e.target.value)}}
                />
                <Input
                placeholder={"password"}
                type={"password"}
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)}}
                />
                <Button
                    type={"submit"}
                    onClick={signUp}
                >Sign Up</Button>
            </form>
            </div>
        </Modal>
        <Modal
            open={openSignIn}
            onClose={()=>{setOpenSignIn(false)}}
        >
            <div style={modalStyle} className={classes.paper}>
                <form className={"app__signup"}>
                    <img className={"app__headerImage"}/>
                    <Input
                        placeholder={"email"}
                        type={"text"}
                        value={email}
                        onChange={(e)=>{
                            setEmail(e.target.value)}}
                    />
                    <Input
                        placeholder={"password"}
                        type={"password"}
                        value={password}
                        onChange={(e)=>{
                            setPassword(e.target.value)}}
                    />
                    <Button
                        type={"submit"}
                        onClick={signIn}
                    >Sign In</Button>
                </form>
            </div>
        </Modal>
      <div className="app__header">
           <img className="app__headerImage"
                src={igLogo}
                alt=""/>
          {user?
              (<Button onClick={()=>auth.signOut()}>Log Out</Button>)
              :
              (
                  <div className="app__loginContainer">
                      <Button onClick={()=>{setOpenSignIn(true)}}>Sign In</Button>
                      <Button onClick={()=>{setOpen(true)}}>Sign Up</Button>
                  </div>)
          }
      </div>

       <div className={"app__posts"}>
        {posts.map(({id,post})=>(
            <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                imageUrl={post.imageUrl}
                caption={post.caption}
            ></Post>
        ))}
        {user?.displayName ?
            (<ImageUpload username={user.displayName}/>):
            <h3>Sorry need to log in</h3>
        }
       </div>
    </div>
  );
}

export default App;
