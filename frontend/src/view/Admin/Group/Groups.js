import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import axios from 'axios'
import { allUsersRoute, createGroupRoute, getGroups, signupRoute, updateGroupInfo } from '../../../utils/APIRoutes'
import { setProps } from '../../../redux/action'
import { connect } from 'react-redux'
import FormModal from '../Users/FormModal'
import { store } from '../../..'
import { ToastContainer, toast } from 'react-toastify'
import { updateUser } from '../../../utils/APIRoutes'
import { IISMethods } from '../../../config/IISMethods'
import GroupTable from './GroupTable'
import GroupFormModal from './GroupFormModal'
import { useNavigate } from 'react-router'

function Groups(props) {

    const navigate = useNavigate()

    const getCurrentState = () => {
        return store.getState()
    }

    const [formModal, setFormModal] = useState(false)

    const [personName, setPersonName] = React.useState([])
    const [adminName, setAdminName] = React.useState()

    useEffect(() => {
        async function runUseEffect(){
            if(!localStorage.getItem("chat-app-admin")){
                navigate("/admin")
            }
            else {
                const data = await axios.post(`${getGroups}`)
                await props.setProps({groupData : data.data})
            }
        }
        runUseEffect()
    }, [])

    const handleGrid = async (type, key, value) => {
        // if(type == "modal"){
        //     if(value){
        //         getCurrentState().modal[key] = value
        //     }
        //     else {
        //         delete getCurrentState().modal[key]
        //     }
        //     await props.setProps({modal : getCurrentState().modal})
        // }
    }

    const setFormData = async (id, data) => {
        setFormModal(true)
        let tempFormData = {}
        if(id){
            setAdminName(IISMethods.getobjectfromarray(getCurrentState().userData, '_id', data.groupAdmin[0]._id).username)
            let tempArr = []
            data.users.map((user) => tempArr.push(user.username))
            setPersonName(tempArr)

            tempFormData.groupAdmin = data.groupAdmin[0]._id
            tempFormData = data
        }
        else {
            tempFormData.users = []
        }
        
        await props.setProps({formData : tempFormData})
    }

    const handleFormData = async (type,key,value) => {
        let tempData = getCurrentState().formData
        if(type == "input-text"){
            tempData[key] = value
        }
        await props.setProps({formData: tempData})
    }

    const handleAddButtonClick = async () => {
        if(getCurrentState().formData._id){
            await updateData()
        }
        else {
            await addData()
        }
    }

    const addData = async () => {
        try {
            const { data } = await axios.post(createGroupRoute, {
                name : getCurrentState().formData.chatName,
                users : JSON.stringify(getCurrentState().formData.users),
                loggedInUser : getCurrentState().formData.groupAdmin
            })
            let tempData = [data, ...getCurrentState().groupData]
            await props.setProps({groupData : tempData})

        } catch (error) {
            console.log(error)
        }
    }

    const updateData = async () => {
        try {
            const { data } = await axios.put(updateGroupInfo, {
                chatId : getCurrentState().formData._id,
                chatName : getCurrentState().formData.chatName,
                users : getCurrentState().formData.users,
                groupAdmin : getCurrentState().formData.groupAdmin,
                isBlocked : getCurrentState().formData.isBlocked
            })
            if(data.status === 404){
                generateError(data.msg)
            }

            // if(data.status === 200){
                setFormModal(false)   
                let tempData = [...getCurrentState().groupData]
                const index = IISMethods.getindexfromarray(tempData, '_id', data._id)
                tempData[index] = data
                await props.setProps({groupData: tempData})
            // }
        } catch (error) {
            console.log(error)
        }
    }
    
    const generateError = (err) => {
        console.log(err)
        toast.error(err, {
            position: "bottom-right"
        })
    }

    return (
        <>
            <div className="admin-list">
                <Sidebar/>
                <div className="listContainer">
                    {/* <Navbar/> */}
                    <GroupFormModal
                        handleGrid={handleGrid}
                        formModal={formModal}
                        setFormModal={setFormModal}
                        handleFormData={handleFormData}
                        handleAddButtonClick={handleAddButtonClick}

                        setAdminName={setAdminName}
                        adminName={adminName}
                        setPersonName={setPersonName}
                        personName={personName}
                    />
                    <GroupTable
                        handleGrid={handleGrid}
                        setFormData={setFormData}
                    />
                </div>
            <ToastContainer></ToastContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Groups)