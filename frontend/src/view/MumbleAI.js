import React, { useState, useEffect } from 'react'
import send from '../assets/send.svg'
import bot from '../assets/bot.svg'
import user from '../assets/user.svg'
import { mumbleAI } from '../utils/APIRoutes'
import axios from 'axios'
import NavigationBar from '../components/NavigationBar'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'

function MumbleAI() {

    const navigate = useNavigate()

    const [promt, setPromt] = useState('')
    const [chatData, setChatData] = useState([])

    useEffect(() => {
        if(!localStorage.getItem("chat-app-user")){
            navigate("/login")
        }
    }, [])
    

    let loadInterval

    const loader = (element) => {
        element.textContent = ''

        loadInterval = setInterval(() => {
            // Update the text content of the loading indicator
            element.textContent += '.';

            // If the loading indicator has reached three dots, reset it
            if (element.textContent === '....') {
                element.textContent = '';
            }
        }, 300);
    }

    const typeText = (element, text) => {
        // console.log(element, text)
        let index = 0

        let interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index)
                index++
            } else {
                clearInterval(interval)
            }
        }, 20)
    }

    const chatStripe = async (isAi, value, id) => {
        // console.log(isAi, value, id)
        return (
            `<div class="center-div ${isAi && 'ai'}">
                <div class="wrapper">
                    <div class='ai-chat'>
                        <div class="ai-chat-profile">
                            <img src=${isAi ? bot : user} alt="${isAi ? 'bot' : 'user'}" />
                        </div>
                        <div class="ai-chat-message" id=${id}>${value}</div>
                    </div>
                </div>
            </div>
            `
        )
    }

    const generateUniqueId = () => {
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const hexadecimalString = randomNumber.toString(16);

        return `id${timestamp}${hexadecimalString}`;
    }

    const generateError = (err) => {
        toast.error(err, {
            position: "bottom-right"
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!promt){
            generateError("Please write prompt")
        }
        else {
            const data = new FormData(document.getElementById('ai_form'))
            const chatContainer = document.querySelector('#chat-container')
            chatContainer.innerHTML += await chatStripe(false, promt)
    
            chatData.push({
                isAi : false,
                value : promt,
                id : ''
            })
    
            setChatData(chatData)
            setPromt('')
    
            const id = generateUniqueId()
            const tempObj = {
                isAi : true,
                value : "",
                id : id
            }
    
            chatData.push(tempObj)
            setChatData(chatData)
    
            chatContainer.innerHTML += await chatStripe(true, '', id)
    
            // to focus scroll to the bottom 
            chatContainer.scrollTop = chatContainer.scrollHeight
            const messageDiv = document.getElementById(id)
            
            // console.log("messageDiv", messageDiv)
            
            loader(messageDiv)
            
    
            const response = await axios.post(mumbleAI, 
                JSON.stringify({prompt : promt}),
                {
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET_KEY}`
                    }
                }
            )

            // const response = await fetch('http://localhost:4000/mumbleai', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET_KEY}`,
            //     },
            //     body: JSON.stringify({
            //         prompt: promt
            //     })
            // })
    
            clearInterval(loadInterval)
            messageDiv.innerHTML = " "
    
            if(response.status == 200){
                const data = await response.data
                const parsedData = data.bot.trim() // trims any trailing spaces /'\n'
                typeText(messageDiv, parsedData)
            }
            else {
                const err = await response.text()
                messageDiv.innerHTML = 'Something went wrong'
                console.log(err)
                alert(err)
            }
        }



    }

    return (
        <>
            <NavigationBar />
            <div id="aiapp" className='ai-main-div'>
                <div id="chat-container">
                    {/* {
                        chatData?.map((obj) => (
                            <div className={`wrapper ${obj.isAi ? 'ai' : ''}`}>
                                <div className='ai-chat'>
                                    <div className="ai-chat-profile">
                                        <img src={obj.isAi ? bot : user} alt={obj.isAi ? 'bot' : 'user'} />
                                    </div>
                                    <div className="ai-chat-message" id={obj.id}>
                                        {obj.value}
                                    </div>
                                </div>
                            </div>
                        ))
                    } */}
                </div>
                <form className='ai-form' id="ai_form">
                    <div className='ai-form-box'>
                        <textarea className='ai-textarea' name="prompt" rows="1" cols="1" placeholder="Ask MumbleAI..."
                            onChange={(e) => setPromt(e.target.value)}
                            value={promt}
                        ></textarea>
                        <button className='ai-textarea-btn' type='submit' onClick={(e) => handleSubmit(e)}><img src={send} alt="send" /></button>
                    </div>
                </form>
            </div>
            <ToastContainer ></ToastContainer>
        </>
    )
}

export default MumbleAI