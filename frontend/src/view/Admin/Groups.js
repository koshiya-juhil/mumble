import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import { allUsersRoute, getGroups, signupRoute } from '../../utils/APIRoutes'
import { setProps } from '../../redux/action'
import { connect } from 'react-redux'
import FormModal from './FormModal'
import { store } from '../..'
import { ToastContainer, toast } from 'react-toastify'
import { updateUser } from '../../utils/APIRoutes'
import { IISMethods } from '../../config/IISMethods'
import GroupTable from './GroupTable'

function Groups(props) {

    const getCurrentState = () => {
        return store.getState()
    }

    const [formModal, setFormModal] = useState(false)

    useEffect(() => {
        async function runUseEffect(){
            const data = await axios.post(`${getGroups}`)
            await props.setProps({groupData : data.data})
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
            tempFormData._id = data._id
            tempFormData.username = data.username
            tempFormData.email = data.email
            tempFormData.password = data.password
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
            const { data } = await axios.post(signupRoute, getCurrentState().formData)
            if(data.status === false){
                generateError(data.msg)
            }

            if(data.status === true){
                setFormModal(false)
                let tempData = [...getCurrentState().userData]
                const obj = data.user
                tempData.push(obj)
                await props.setProps({userData : tempData})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateData = async () => {
        try {
            const { data } = await axios.put(updateUser, getCurrentState().formData)
            if(data.status === 404){
                generateError(data.msg)
            }

            // if(data.status === 200){
                setFormModal(false)   
                let tempData = [...getCurrentState().userData]
                const index = IISMethods.getindexfromarray(tempData, '_id', getCurrentState().formData._id)
                tempData[index] = data
                await props.setProps({userData: tempData})
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
                    {/* <FormModal
                        handleGrid={handleGrid}
                        formModal={formModal}
                        setFormModal={setFormModal}
                        handleFormData={handleFormData}
                        handleAddButtonClick={handleAddButtonClick}
                    /> */}
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