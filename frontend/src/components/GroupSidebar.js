import axios from 'axios'
import React, { useState } from 'react'
import { Badge, Button, Form, Modal } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import { IISMethods } from '../config/IISMethods'
import { addUserToGroup, removeUserFromGroup, renameGroup, updateGroupUsers } from '../utils/APIRoutes'

import { connect } from 'react-redux'
import { store } from '../index'
import { setProps } from '../redux/action'

function GroupSidebar(props) {

    const getCurrentState = () => {
        return store.getState()
    }

    const [nameEdit, setNameEdit] = useState(false)
    const [groupName, setGroupName] = useState(getCurrentState().selectedChat.chatName)
    const [renameLoading, setRenameLoading] = useState(false)
    const [userEdit, setUserEdit] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])


    const handleRename = async () => {
        try {
            setRenameLoading(true)

            const { data } = await axios.put(renameGroup, {
                chatId : getCurrentState().selectedChat._id,
                chatName : groupName
            })

            // console.log(data)
            
            props.setSelectedChatData(data)
            setRenameLoading(false)

            await props.setProps({selectedChat : data})
            
            // to update data in redux
            let tempChatdata = getCurrentState().chatData
            const index = IISMethods.getindexfromarray(tempChatdata, '_id', data._id)
            tempChatdata[index] = data
            
            await props.setProps({chatData : tempChatdata})

            setNameEdit(false)

        } catch (error) {
            toast({
                title : "Error Occured!",
                description : error.response.data.message,
                status : "error",
                duration : 5000,
                isClosable : true,
                position : "bottom"
            })
            setRenameLoading(false)
        }
    }

    const handleUsers = async (user, action) => {
        // console.log(selectedUsers, user)
        if(action == 'add'){
            if(IISMethods.getindexfromarray(selectedUsers, '_id', user._id) !== -1){
                toast.error("User Already Exist", {
                    position: "bottom-right"
                })
                // toast({
                //     title : "User Already Exist",
                //     status : "error",
                //     duration : 5000,
                //     isClosable : true,
                //     position : "bottom"
                // })
            }
            else {
                setSelectedUsers([...selectedUsers, user])

                // add user to group api
                const { data } = await axios.put(addUserToGroup, {
                    chatId : getCurrentState().selectedChat._id,
                    userId : user._id
                })

                console.log(data)

                await props.setProps({selectedChat : data})
                // to update data in redux
                let tempChatdata = getCurrentState().chatData
                const index = IISMethods.getindexfromarray(tempChatdata, '_id', data._id)
                tempChatdata[index] = data
                
                await props.setProps({chatData : tempChatdata})
            }
        }
        else if(action == 'remove'){
            setSelectedUsers(selectedUsers.filter(obj => obj._id !== user._id))
            await removeUser(user)
        }
    }

    const updateUsers = async() => {
        try {
            const { data } = await axios.put(updateGroupUsers, {
                chatId : getCurrentState().selectedChat._id,
                users : JSON.stringify(selectedUsers.map(u => u._id))
            })
            console.log(data)


            await props.setProps({selectedChat : data})
            // to update data in redux
            let tempChatdata = getCurrentState().chatData
            const index = IISMethods.getindexfromarray(tempChatdata, '_id', data._id)
            tempChatdata[index] = data    
            await props.setProps({chatData : tempChatdata})

        } catch (error) {
            console.log(error)
        }
    }

    const removeUser = async (user) => {
        try {
            const { data } = await axios.put(removeUserFromGroup, {
                chatId : getCurrentState().selectedChat._id,
                userId : user._id
            })
            console.log(data)

            await props.setProps({selectedChat : data})
            // to update data in redux
            let tempChatdata = getCurrentState().chatData
            const index = IISMethods.getindexfromarray(tempChatdata, '_id', data._id)
            tempChatdata[index] = data
            
            await props.setProps({chatData : tempChatdata})

        } catch (error) {
            
        }
    }

    return (
        <>
            <div className='sidebar-div' id='groupSidebar' style={{ color: "#ffffff", padding: "10px" }}>
                <div style={{ display: "flex", height: "2.5rem", alignItems: "center" }}>
                    <div style={{ display: "flex" }}><span class="material-symbols-outlined" style={{ cursor: "pointer" }} onClick={() => props.handleSidebar('close')}>chevron_right</span></div>
                    <span style={{}}>Group Details</span>
                </div>
                <div>
                    <div>
                        <label style={{ fontSize: "12px" }}>Group Name</label>
                        <div className='mb-3' style={{ fontSize: "20px", display: "flex", justifyContent: "space-between" }}>
                            <span>
                                {
                                    !nameEdit ? getCurrentState().selectedChat.chatName 
                                    : 
                                    <>
                                        <Form.Control
                                            value={groupName}
                                            className="modal-input"
                                            onChange={(e) => setGroupName(e.target.value)}
                                        >    
                                        </Form.Control>
                                    </>
                                }
                            </span>
                            {
                                !nameEdit ? 
                                    <span class="material-symbols-outlined" style={{ fontSize: "16px", display: "contents", cursor: "pointer" }} onClick={() => {setNameEdit(!nameEdit); setGroupName(getCurrentState().selectedChat.chatName)}}>edit</span>
                                : 
                                    <span style={{display: "flex", gap: "4px", marginLeft: "5px"}}>
                                        <Button variant='success' disabled={renameLoading} style={{display: "flex", padding: "4px"}} onClick={() => !renameLoading ? handleRename() : null}>
                                            {
                                                renameLoading ? 
                                                    <span class="loader"></span>
                                                :
                                                    <span class="material-symbols-outlined">done</span>
                                            }
                                        </Button>
                                        <Button variant='danger' style={{display: "flex", padding: "4px"}} onClick={() => setNameEdit(false)}><span class="material-symbols-outlined">close</span></Button>
                                    </span>
                            }
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: "18px", display: "flex", justifyContent: "space-between" }}>
                            <span>Participants</span>
                            {
                                !userEdit ?
                                    IISMethods.getindexfromarray(getCurrentState().selectedChat.groupAdmin, '_id', getCurrentState().currentUser._id) !== -1 ?
                                        <span class="material-symbols-outlined" style={{ fontSize: "16px", display: "contents", cursor: "pointer" }} onClick={() => {setUserEdit(!userEdit)}}>edit</span>
                                    : <></>
                                : 
                                    <span style={{display: "flex", gap: "4px", marginLeft: "5px"}}>
                                        <Button variant='secondary' size='sm' onClick={() => {setShowModal(true); setSelectedUsers(getCurrentState().selectedChat.users)}}>Add Participant</Button>
                                        <Button variant='danger' style={{display: "flex", padding: "1px"}} size='sm' onClick={() => setUserEdit(false)}><span class="material-symbols-outlined">close</span></Button>
                                    </span>
                            }
                        </div>
                        <div>
                            {
                                getCurrentState().selectedChat.users.map((user) => {
                                    return (
                                        <div className='d-flex' style={{ gap: "10px", margin: "10px 0px" }}>
                                            <div className="avatar">
                                                <img src={`data:image/svg+xml;base64,${user.avatarImage}`} />
                                            </div>
                                            <div className="username">
                                                <span>{user.username}</span>
                                            </div>
                                            {
                                                IISMethods.getindexfromarray(getCurrentState().selectedChat.groupAdmin, '_id', user._id) !== -1 ?
                                                    <div style={{marginLeft: "auto"}}>Admin</div>
                                                : <></>
                                            }
                                            {
                                                userEdit ?
                                                    <span class="material-symbols-outlined" onClick={() => removeUser(user)} style={{marginLeft : "auto", cursor: "pointer", color: "#dc3545", fontSize: "20px", display: "flex", alignItems: "center"}}>close</span>
                                                : <></>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        placeholder='Add Users eg: Juhil, Shiv, Parth'
                        className='mb-1 modal-input'
                        onClick={() => setShowUsers(!showUsers)}
                    ></Form.Control>
                    <div className='d-flex gap-1' style={{marginLeft : '4px'}}>
                        {
                            selectedUsers?.map((user) => {
                                return (
                                    <Badge bg='primary'>
                                        <span className='pb-1' style={{fontSize : '14px'}}>{user.username}</span> 
                                        <span class="material-icons" style={{fontSize : "14px", cursor: 'pointer'}} onClick={() => handleUsers(user, 'remove')}>close</span> 
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
                                    <div className='contact' onClick={() => handleUsers(user, 'add')}>
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
                    <Button variant='primary' onClick={() => {setShowModal(false); updateUsers()}}>Update</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer></ToastContainer>
        </>
    )
}

const mapStateToProps = state => ({
    ...state
  }) 
  
  const mapDispatchToProps = dispatch => ({
    setProps : (payload) => dispatch(setProps(payload))
  })

export default connect(mapStateToProps, mapDispatchToProps)(GroupSidebar)