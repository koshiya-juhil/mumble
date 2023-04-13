// import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { groupColumns, userColumns, userRows } from "../datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { store } from "../../..";
import { connect } from "react-redux";
import axios from "axios";
import { allUsersRoute, deleteGroup, deleteUser, updateGroupInfo, updateUser } from "../../../utils/APIRoutes";
import { IISMethods } from "../../../config/IISMethods";
import { setProps } from '../../../redux/action'
import { Button } from "@mui/material";
import { useEffect } from "react";

const GroupTable = (props) => {
    const getCurrentState = () => {
        return store.getState()
    }

    useEffect(() => {
        async function runUseEffect(){
            // debugger
            const data = await axios.get(`${allUsersRoute}/64086e1fac22ad218d17bb7f`)
            // data.data.map(obj => obj.id = obj._id)
            await props.setProps({userData : data.data})
        }
        runUseEffect()
    }, [])

    // const [data, setData] = useState(userRows)

    // console.log(getCurrentState().userData)

    const handleDelete = async (id) => {
        const { res } = await axios.delete(deleteGroup, {data : {"chatId": id}})

        const tempData = [...getCurrentState().groupData]
        const index = IISMethods.getindexfromarray(tempData, "_id", id)
        tempData.splice(index,1)
        await props.setProps({ groupData : tempData })
    }

    const handleUserUpdate = async (obj) => {
        let tempObj = {}
        let tempArr = []
        obj.users.map((temp) => tempArr.push(temp._id))

        tempObj.isBlocked = !obj.isBlocked
        tempObj.chatId = obj._id
        tempObj.groupAdmin = obj.groupAdmin[0]._id
        tempObj.users = tempArr
        tempObj.chatName = obj.chatName
        const { data } = await axios.put(updateGroupInfo, tempObj)

        console.log(data)

        let tempData = [...getCurrentState().groupData]
        const index = IISMethods.getindexfromarray(tempData, '_id', data._id)
        tempData[index] = data
        await props.setProps({groupData: tempData})
    }

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                <div className="cellAction">
                    <div className="viewButton" onClick={() => props.setFormData(params.row._id, params.row)}>Edit</div>
                    <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>Delete</div>
                    <div className="deleteButton" onClick={() => handleUserUpdate(params.row)}>{params.row.isBlocked ? "UnBlock" : "Block"}</div>
                </div>
                );
            },
        },
    ]

    

    return (
        <div className="datatable">
        <div className="datatableTitle">
            Groups
            <Button variant="contained" onClick={() => props.setFormData()}>Create Group</Button>
        </div>
        <DataGrid
            className="datagrid"
            rows={getCurrentState().groupData}
            columns={groupColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            getRowId={(row) => row._id}
            // checkboxSelection
        />
        </div>
    )
}

const mapStateToProps = state => ({
    ...state
}) 

const mapDispatchToProps = dispatch => ({
    setProps : (payload) => dispatch(setProps(payload))
})

export default connect(mapStateToProps,mapDispatchToProps)(GroupTable)
