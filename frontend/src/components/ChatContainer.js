import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput'
import axios from 'axios'
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes'
import { v4 as uuidv4 } from "uuid"
import GroupSidebar from './GroupSidebar'
import Lottie from 'react-lottie'
import typingData from '../assets/typing.json'

import { connect } from 'react-redux'
import { store } from '../index'
import { setProps } from '../redux/action'
import { IISMethods } from '../config/IISMethods'

function ChatContainer(props) {

  const [messages, setMessages] = useState([])
  const scrollRef = useRef() // fro socket

  const [isTyping, setIsTyping] = useState(false)
  const [typing, setTyping] = useState(false)

  const getCurrentState = () => {
    return store.getState()
  }

  // for socket

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour : "smooth" })
  }, [messages])

  // runs every time state updates
  useEffect(() => {
    // when message receives
    props.socket.current.on("message-received", async (newMessage) => {
      // console.log(newMessage)
      
      if(!getCurrentState().selectedChat || getCurrentState().selectedChat._id !== newMessage.chatid._id){
        // notification
        if(!getCurrentState().notifications.length || !(getCurrentState().notifications.includes(newMessage))){
          await props.setProps({notifications : [newMessage, ...getCurrentState().notifications]})
        }
      }
      else {
        setMessages([...messages, newMessage])
      }
    })
  })
  

  useEffect(() => {
    props.socket.current.on("typing",() => setIsTyping(true))
    props.socket.current.on("stop-typing",() => setIsTyping(false))
  }, [])
  



  // end

  // get messages of chat on change of chat
  useEffect(() => {
    async function runUseEffect() {
      const response = await axios.post(getAllMessagesRoute, {
        chatId : getCurrentState().selectedChat._id, 
        loggedInUser : getCurrentState().currentUser._id
      })
      setMessages(response.data)

      await props.setProps({messageData : response.data})

      // join room
      props.socket.current.emit("join-room", getCurrentState().selectedChat._id)
    }
    if(getCurrentState().selectedChat){
      runUseEffect()
    }
  }, [getCurrentState().selectedChat])


  const handleSendMsg = async (msg) => {

    props.socket.current.emit("stop-typing", getCurrentState().selectedChat._id)

    const data = await axios.post(sendMessageRoute, {
      loggedInUser : getCurrentState().currentUser._id,
      chatId : getCurrentState().selectedChat._id,
      message : msg
    })

    props.socket.current.emit("new-message", data.data)
    setMessages([...messages, data.data])

    await props.setProps({messageData : [...getCurrentState().messageData, data.data]})

    // end
  }

  const handleSidebar = (key) => {
    if(key === 'open'){
      document.getElementById("groupSidebar").style.display = "block"
    }
    else if(key === 'close'){
      document.getElementById("groupSidebar").style.display = "none"
    }
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  return (
    <>
      <div style={{display: "flex"}}>
        <div className='main-div' style={{height: "100%", width: "100%"}}>
          <div className="chat-header" style={{backgroundColor: "#ffffff34", maxHeight: "60px"}}>
              <div className="user-details">
                  <div className="avatar">
                    {
                      getCurrentState().selectedChat.isGroupChat ? 
                        <span class="material-symbols-outlined" style={{color: '#ffffff'}}>tag</span>
                      :
                        <img src={`${getCurrentState().selectedChat.users.filter(a => a._id !== getCurrentState().currentUser._id)[0].isAvatarImageSet ? 'data:image/svg+xml;base64,' : ''}${getCurrentState().selectedChat.users.filter(a => a._id !== getCurrentState().currentUser._id)[0].avatarImage}`} style={{height: "2rem", borderRadius: "50%"}}/>
                    }
                        {/* <img src={`data:image/svg+xml;base64,${props.currentChat.avatarImage}`} style={{height: "2rem"}}/> */}
                  </div>
                  <div className="username">
                    {/* <span>{getCurrentState().selectedChat.isGroupChat ? getCurrentState().selectedChat.chatName : props.currentChat.username}</span> */}
                    <span>{getCurrentState().selectedChat.isGroupChat ? getCurrentState().selectedChat.chatName : getCurrentState().selectedChat.users.filter(a => a._id !== getCurrentState().currentUser._id)[0].username}</span>
                  </div>
              </div>
              {
                getCurrentState().selectedChat.isGroupChat ?
                  <span class="material-symbols-outlined" style={{color: '#ffffff', cursor: "pointer"}} onClick={() => handleSidebar('open')}>chevron_left</span>
                : <></>
              }
          </div>
          <div className="chat-messages">
            {
              messages?.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    {
                      message.sender?._id !== getCurrentState().currentUser?._id && getCurrentState().selectedChat.isGroupChat ?
                      <div className={"message received"} style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                        <div className="content">
                          <div className='d-flex align-items-center'>
                            <img src={`${IISMethods.getobjectfromarray(getCurrentState().userData, '_id', message.sender?._id)?.isAvatarImageSet ? 'data:image/svg+xml;base64,' : ''}${message.sender?.avatarImage}`} style={{width: '20px', height: '20px'}} />
                            <p style={{color: 'white', marginBottom : '0px', fontWeight: '600', marginLeft: '5px'}}>{message.sender?.username}</p>
                          </div>
                          <p>{message.message.text}</p>
                        </div>
                      </div>
                        :
                      <div className={`message ${message.sender?._id == getCurrentState().currentUser?._id ? "sended" : "received"} `}>
                        <div className="content">
                          <p>{message.message.text}</p>
                        </div>
                      </div>

                    }
                  </div>
                )
              })
            }
            {
              isTyping ? 
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={100}
                    height={40}
                    style={{marginBottom: 0, marginLeft: 0}}
                  />
                </div> 
              : <></>
            }
          </div>
          <ChatInput 
            handleSendMsg={handleSendMsg} 
            socketConnected={props.socketConnected}
            isTyping={isTyping}
            socket={props.socket}
            selectedChatData={getCurrentState().selectedChat}
          />
        </div>


        <GroupSidebar
          selectedChatData = {getCurrentState().selectedChat}
          handleSidebar = {handleSidebar}
          setSelectedChatData = {props.setSelectedChatData}
          contacts={props.contacts}
          currentUser={getCurrentState().currentUser}
        />

        {/* <div className='sidebar-div' id='groupSidebar' style={{color: "#ffffff", padding: "10px"}}>
          <div style={{display: "flex", height: "2.5rem", alignItems: "center"}}>
            <div style={{display: "flex"}}><span class="material-symbols-outlined" style={{cursor: "pointer"}} onClick={() => handleSidebar('close')}>chevron_right</span></div>
            <span style={{}}>Group Details</span>
          </div>
          <div>
            <div>
              <label style={{fontSize: "12px"}}>Group Name</label>
              <div className='mb-3' style={{fontSize: "20px"}}>
                <span>{getCurrentState().selectedChat.chatName}</span>
                <span class="material-symbols-outlined" style={{fontSize : "16px", display: "contents", cursor: "pointer"}}>edit</span>
              </div>
            </div>
            <div>
              <div>Users</div>
              <div>
                {
                  getCurrentState().selectedChat.users.map((user) => {
                    return (
                      <div className='d-flex' style={{gap: "10px", margin: "10px 0px"}}>
                        <div className="avatar">
                          <img src={`data:image/svg+xml;base64,${user.avatarImage}`} />
                        </div>
                        <div className="username">
                          <span>{user.username}</span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div> */}

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

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer)