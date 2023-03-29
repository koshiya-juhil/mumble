import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { setAvatarRoute } from "../utils/APIRoutes"
// import { Container } from "react-bootstrap"
import { Buffer } from "buffer"
import styled from "styled-components"

function SetAvatar() {

  const api = "https://api.multiavatar.com/1254125"
  const navigate = useNavigate()

  const [avatars, setAvatars] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  const setProfilePicture = async () => {
    if(selectedAvatar === undefined){
      toast.error("Please select an Avatar", toastOptions)
    }
    else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"))
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      })

      if(data.isSet) {
        user.isAvatarImageSet = true
        user.avatarImage = data.image
        localStorage.setItem("chat-app-user", JSON.stringify(user))
        navigate('/home')
      }
      else {
        toast.error("Error setting avatar. Please try again", toastOptions)
      }
    }
  }

  useEffect(() => {
    async function runUseEffect(){
      const data = []
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
        const buffer = new Buffer(image.data)
        data.push(buffer.toString("base64"))
      }
      setAvatars(data)
      // console.log("data",data)
    }
    runUseEffect()
  }, [])

  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login")
    }
  }, [])

  return (
    <>
      <div className="avatar-container">
        <div className="title-container">
          <h1>Pick an Avatar as your profile picture</h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar, index) => {
            return (
              <div className={`avatar ${selectedAvatar === index ? 'selected' : ''}`} key={index}>
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar"
                  onClick={() => setSelectedAvatar(index)} />
              </div>
            )
          })}
        </div>
        <button className="submit-btn" onClick={() => setProfilePicture()} >
          Set as Profile Picture
        </button>
      </div>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default SetAvatar

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  ${'' /* height: calc(100vh - 57px); */}
  height: 100vh;
  width: 100vw;

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;