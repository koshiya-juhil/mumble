import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import { IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'

function ChatInput(props) {
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [msg, setMsg] = useState("")

    const [typing, setTyping] = useState(false)

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (e, emoji) => {
        // console.log(emoji, emoji.emoji)
        let message = msg 
        message += emoji.emoji
        setMsg(msg)
        // console.log(msg)
    }

    const sendChat = (e) => {
        e.preventDefault()
        if(msg.length > 0){
          props.handleSendMsg(msg)
          setMsg("")
        }
    }

    const handleMessage = (value) => {
      setMsg(value)

      if(!props.socketConnected) return
      
      if(!typing){
        setTyping(true)
        props.socket.current.emit("typing", props.selectedChatData._id)
      }

      let lastTypingTime = new Date().getTime()
      let timerLength = 3000
      setTimeout(() => {
        let timeNow = new Date().getTime()
        let timeDiff = timeNow - lastTypingTime
        if(timeDiff >= timerLength && typing){
          props.socket.current.emit("stop-typing", props.selectedChatData._id)
          setTyping(false)
        }
      }, timerLength);
    }

    return (
      <>
        <div className='chat-input-container'>
            {/* <></> */}
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                    {
                      showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                    }
                </div>
            </div>
            <form className='input-container' onSubmit={(e) => sendChat(e)}>
              <input type="text" placeholder="type your message here"
                value={msg}
                onChange={(e) => handleMessage(e.target.value) }
                onBlur={() => {
                  props.socket.current.emit("stop-typing", props.selectedChatData._id)
                  setTyping(false)
                }}
              />
              <button className="submit">
                  <IoMdSend />
              </button>
            </form>
        </div>
      </>
    )
}

export default ChatInput

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  height : 60px !important;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .EmojiPickerReact {
        position: absolute;
        top: -460px;
        background-color: #080420;
        ${'' /* box-shadow: 0 5px 10px #9a86f3; */}
        ${'' /* border-color: #9a86f3; */}
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .epr-category-nav {
          button {
            filter: contrast(0);
          }
        }
        .epr-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .epr-emoji-category-label {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      ${'' /* height: 60%; */}
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`