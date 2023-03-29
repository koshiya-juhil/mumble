import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import NavigationBar from '../components/NavigationBar'
import styled from 'styled-components'
import axios from 'axios'
import { accessChat, allUsersRoute, host } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import WelcomeChat from '../components/WelcomeChat'
import ChatContainer from '../components/ChatContainer'
import { io } from 'socket.io-client'

import { connect } from 'react-redux'
import { store } from '../index'
import { setProps } from '../redux/action'

function Home(props) {

  const navigate = useNavigate()
  const socket = useRef()

  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [selectedChatData, setSelectedChatData] = useState(undefined)

  const [socketConnected, setSocketConnected] = useState(false)

  const getCurrentState = () => {
    return store.getState()
  }

  // set logged in user data to localstorage
  useEffect(() => {
    async function runUseEffect() {
      if(!localStorage.getItem("chat-app-user")){
        navigate("/login")
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
        await props.setProps({currentUser : JSON.parse(localStorage.getItem("chat-app-user"))})
      }

    }
    runUseEffect()
  }, [])

  // socket
  
  useEffect(() => {
    if(currentUser){
      socket.current = io(host)
      socket.current.emit("setup", currentUser._id)
      socket.current.on("connected", () => {
        setSocketConnected(true)
      })
    }
  }, [currentUser])
  // end
  
  // if(socket){
  //   socket?.current?.on("message-received", (newMessage) => {
  //     console.log(newMessage)
  //   })
  // }

  // get contacts data
  useEffect(() => {
    async function runUseEffect() {
      if(currentUser && currentUser.avatarImage){
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
        setContacts(data.data)

        await props.setProps({userData : data.data})
      }
      else {
        
      }
    }
    runUseEffect()
  }, [currentUser])

  const handleChatChange = async (chat) => {
    setCurrentChat(chat)

    const payload = {
      "userId" : chat._id,
      "loggedInUser": currentUser._id
    }

    const { data } = await axios.post(accessChat, payload)
    // console.log(data)
    setSelectedChatData(data)

    await props.setProps({selectedChat : data})
  }
  
  const handleGroupChange = async (data) => {
    setSelectedChatData(data)
    await props.setProps({selectedChat : data})
  }

  return (
    <>
      <NavigationBar />
      <div className='home-main-div'>
        <div className="containerhome">
          <Contacts 
            contacts={contacts} 
            currentUser={currentUser}
            handleChatChange={handleChatChange}
            handleGroupChange={handleGroupChange}
          />
          {
            selectedChatData === undefined ? 
              <WelcomeChat currentUser={currentUser} />
            : 
              <ChatContainer 
                currentChat={currentChat} 
                currentUser={currentUser}
                socket={socket}
                selectedChatData={selectedChatData}
                setSelectedChatData={setSelectedChatData}
                contacts={contacts}
                socketConnected={socketConnected}
              />
          }
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  ...state
}) 

const mapDispatchToProps = dispatch => ({
  setProps : (payload) => dispatch(setProps(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)