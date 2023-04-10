// import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { store } from "../..";
import { connect } from "react-redux";
import axios from "axios";
import { deleteUser, updateUser } from "../../utils/APIRoutes";
import { IISMethods } from "../../config/IISMethods";
import { setProps } from '../../redux/action'
import { Button } from "@mui/material";

const GroupTable = (props) => {
    const getCurrentState = () => {
        return store.getState()
    }

    // const [data, setData] = useState(userRows)

    // console.log(getCurrentState().userData)

    const handleDelete = async (id) => {
        const { res } = await axios.delete(deleteUser, {data : {"userid": id}})

        const tempData = [...getCurrentState().userData]
        const index = IISMethods.getindexfromarray(tempData, "_id", id)
        tempData.splice(index,1)
        await props.setProps({ userData : tempData })
    }

    const handleUserUpdate = async (obj) => {
        obj.status = obj.status == "blocked" ? "active" : "blocked"
        const { resdata } = await axios.put(updateUser, obj)
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
                    <div className="deleteButton" onClick={() => handleUserUpdate(params.row)}>{params.row.status == "blocked" ? "UnBlock" : "Block"}</div>
                </div>
                );
            },
        },
    ]

    return (
        <div className="datatable">
        <div className="datatableTitle">
            Groups
            {/* <button className="link" >
                Create User
            </button> */}
            <Button variant="contained" onClick={() => props.setFormData()}>Create Group</Button>
        </div>
        <DataGrid
            className="datagrid"
            rows={getCurrentState().userData}
            columns={userColumns.concat(actionColumn)}
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
