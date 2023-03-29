import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { accessChat, createGroupRoute, getChats } from '../utils/APIRoutes'

import { connect } from 'react-redux'
import { store } from '../index'
import { setProps } from '../redux/action'
import { Accordion, AccordionDetails, AccordionSummary, styled, Typography } from '@mui/material'
import { ArrowForwardIosSharp } from '@mui/icons-material'
import MuiAccordionSummary from '@mui/material/AccordionSummary'

function Contacts(props) {

    const [showModal, setShowModal] = useState(false)
    const [showUsers, setShowUsers] = useState(false)

    const [currentSelected, setCurrentSelected] = useState(undefined)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [groupName, setGroupName] = useState('')
    const [chats, setChats] = useState([])

    const [selectedGroup, setSelectedGroup] = useState(undefined)
    const [expanded, setExpanded] = useState({
      group : true,
      chat : true
    })

    const getCurrentState = () => {
      return store.getState()
    }

    useEffect(() => {
      async function runUseEffect(){
        const { data } = await axios.post(getChats, {
          loggedInUser : getCurrentState().currentUser?._id
        }) 
        // console.log(data)
        setChats(data)

        await props.setProps({chatData : data})
      }
      if(getCurrentState().currentUser){
        runUseEffect()
      }
    }, [getCurrentState().currentUser])
    
    const changeGroup = async (index, data) => {
      setSelectedGroup(index)

      setCurrentSelected(undefined)

      await props.handleGroupChange(data)
    }

    const changeCurrentChat = async (index, contact) => {
      // console.log(contact)
      setCurrentSelected(index)
      await props.handleChatChange(contact)
    }

    const handleGroup = (user, action) => {
      if(action == 'add'){
        if(selectedUsers.includes(user)){
  
        }
        else {
          setSelectedUsers([...selectedUsers, user])
        }
      }
      else if(action == 'remove'){
        setSelectedUsers(selectedUsers.filter(obj => obj._id !== user._id))
      }
    }

    const handleSubmit = async () => {
      // console.log(groupName, selectedUsers)
      if(!groupName || !selectedUsers){
        toast({
          title : "Please fill all the field",
          status : "warning",
          duration : 3000,
          isClosable : true,
          position : "top"
        })
        return
      }

      try {
        const { data } = await axios.post(createGroupRoute, {
          name : groupName,
          users : JSON.stringify(selectedUsers.map(u => u._id)),
          loggedInUser : getCurrentState().currentUser._id
        })

        setChats([data, ...chats])

        await props.setProps({chatData : [data, ...getCurrentState().chatData]})

        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }

    const AccordionSummary = styled((props) => (
      <MuiAccordionSummary 
        expandIcon={<ArrowForwardIosSharp sx={{ fontSize : "0.9rem", color: "white" }} />}
        {...props}
      />
      ))(({ theme }) => ({
        backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, .05)'
          : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
          marginLeft: theme.spacing(1),
        },
    }))

    return (
        <>
            {
                getCurrentState().currentUser && 
                <div className='contacts-main-div'>
                  <div>
                    <div className='d-grid mx-3 mt-3'>
                      <Button variant='outline-secondary' onClick={() => setShowModal(true)}>
                        Create Group
                      </Button>

                      <Modal show={showModal} onHide={() => setShowModal(false)} >
                        <Modal.Header closeButton>
                          <Modal.Title>Create Group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form.Control
                            placeholder='Group Name'
                            className='mb-3 modal-input'
                            onChange={(e) => setGroupName(e.target.value)}
                          ></Form.Control>
                          <Form.Control
                            placeholder='Add Users eg: Juhil, Shiv, Parth'
                            className='mb-1 modal-input'
                            onClick={() => setShowUsers(!showUsers)}
                            // onBlur={() => setShowUsers(false)}
                          ></Form.Control>
                          <div className='d-flex gap-1' style={{marginLeft : '4px'}}>
                            {
                              selectedUsers.map((user) => {
                                return (
                                  <Badge bg='primary'>
                                    <span className='pb-1' style={{fontSize : '14px'}}>{user.username}</span> 
                                    <span class="material-icons" style={{fontSize : "14px", cursor: 'pointer'}} onClick={() => handleGroup(user, 'remove')}>close</span> 
                                  </Badge>
                                )
                              })
                            }
                          </div>
                          {
                            showUsers ?
                              <div className='contacts'>
                                {props.contacts.filter(obj => obj._id !== getCurrentState().currentUser._id).map((user) => {
                                  return (
                                    <div className='contact' onClick={() => handleGroup(user, 'add')}>
                                      <div className='avatar'>
                                        <img src={`data:image/svg+xml;base64,${user.avatarImage}`} />
                                      </div>
                                      <div className='username'>
                                        <span>{user.username}</span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            : <></>
                          }
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant='secondary' onClick={() => setShowModal(false)}>Close</Button>
                          <Button variant='primary' onClick={() => {setShowModal(false); handleSubmit()}}>Create</Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                  <div className="contacts">

                    <Accordion className='contact-accordion' expanded={expanded.group} onChange={() => setExpanded({...expanded, group: !expanded.group})}>
                      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Typography className="accordion-title">Groups</Typography>
                      </AccordionSummary>
                      <AccordionDetails className='contact-accordion-details'>
                        {
                          getCurrentState().chatData.filter(obj => obj.isGroupChat).map((data, index) => {
                            return (
                              <div className={`contact`} key={index} 
                                  // onClick={() => changeCurrentChat(index, contact)}
                                  onClick={() => changeGroup(index, data)}
                              >
                                  <div className="avatar d-flex">
                                    <span class="material-symbols-outlined" style={{color: '#ffffff'}}>tag</span>
                                    {/* <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} /> */}
                                  </div>
                                  <div className="username">
                                    <span>{data.chatName}</span>
                                  </div>
                              </div>
                            )
                          })
                        }
                      </AccordionDetails>
                    </Accordion>

                    <Accordion className='contact-accordion' expanded={expanded.chat} onChange={() => setExpanded({...expanded, chat: !expanded.chat})}>
                      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Typography className="accordion-title">Chats</Typography>
                      </AccordionSummary>
                      <AccordionDetails className='contact-accordion-details'>
                        {
                          getCurrentState().userData.filter(obj => obj._id !== getCurrentState().currentUser._id).map((contact, index) => {
                            return (
                                <div className={`contact ${index === currentSelected ? "selected" : ""}`} key={index}
                                  onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar">
                                      <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} />
                                    </div>
                                    <div className="username">
                                      <span>{contact.username}</span>
                                    </div>
                                </div>
                            )
                          })
                        }
                      </AccordionDetails>
                    </Accordion>

                  </div>
                </div>
            }
        </>
    )
}

const mapStateToProps = state => ({
  ...state
}) 

const mapDispatchToProps = dispatch => ({
  setProps : (payload) => dispatch(setProps(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)