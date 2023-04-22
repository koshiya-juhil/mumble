import React, { useState } from 'react'
import "rsuite/dist/rsuite.min.css";
// import 'rsuite/dist/styles/rsuite-default.css';
import { Button, Modal } from 'rsuite';
import { store } from '../../..';
import { connect } from 'react-redux';
import { setProps } from '../../../redux/action';
import { Autocomplete, Box, Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { IISMethods } from '../../../config/IISMethods';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const GroupFormModal = (props) => {

    const getCurrentState = () => {
        return store.getState()
    }

    
    const [dropdownData, setDropdownData] = useState([])

    const handleChange = async (event) => {
        console.log(event)
        console.log(event.target.value)

        props.setPersonName(event.target.value)

        let tempArr = []
        event.target.value.map((val) => {
            tempArr.push(IISMethods.getobjectfromarray(getCurrentState().userData, 'username',val)._id)
        })
        console.log(tempArr)
        getCurrentState().formData.users = tempArr
        await props.setProps({formData : getCurrentState().formData})

        // const tempid = event.target.value[0]._id
        // let tempData = getCurrentState().formData

        // const index = tempData.users?.indexOf(tempid)
        // if(index == -1){
        //     tempData.users.push(tempid)
        // }
        // else {
        //     tempData.users.splice(index,1)
        // }
        // console.log(tempData.users)
        // await props.setProps({formData : tempData})

        // dropdownData.push({"id":event.target.value[0]._id, "value":event.target.value[0].username})
        // setDropdownData(dropdownData)
        // console.log(dropdownData)
        // // const name = event.target.value[len].username
        // // setPersonName(personName.push(event.target.value[0].username))
        // // console.log(personName)
        // const { target: { value },} = event;
        // setPersonName(
        //     // On autofill we get a stringified value.
        //     typeof value === 'string' ? value.split(',') : value,
        // )
    }

    const handleAdmin = async (event) => {
        props.setAdminName(event.target.value)
        getCurrentState().formData.groupAdmin = IISMethods.getobjectfromarray(getCurrentState().userData, 'username', event.target.value)._id
        await props.setProps({formData : getCurrentState().formData})
    }

    return (
        <div style={{
            display: 'block', width: 700, paddingLeft: 30
        }}>
        {/* <h4>React Suite Modal Component</h4>
        <Button onClick={open}> Open</Button> */}

        <Modal open={props.formModal} size="xs" onClose={() => props.setFormModal(false)}>
            <Modal.Header>
                <Modal.Title>{getCurrentState().formData._id ? "Update" : "Create"} Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TextField id="form-groupname" label="Group Name" variant="standard" style={{width: "100%", marginBottom: "10px"}} 
                    onBlur={(e) => props.handleFormData("input-text", "chatName", e.target.value)}
                    defaultValue={getCurrentState().formData.chatName}
                />
                <FormControl sx={{ mt: 2, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Users</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={props.personName}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            // input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => selected.join(', ')}
                            // renderValue={(selected) => (
                            //     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            //         {dropdownData.map((value) => (
                            //             <Chip key={value.id} label={value.username} />
                            //         ))}
                            //     </Box>
                            // )}
                            MenuProps={MenuProps}
                        >
                        {getCurrentState().userData.map((user) => (
                            <MenuItem key={user._id} value={user.username} name={user.username}>
                                <Checkbox 
                                    checked={props.personName?.indexOf(user.username) > -1} 
                                />
                                <ListItemText primary={user.username} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="standard" sx={{ mt: 2, width: 300 }}>
                    <InputLabel id="demo-simple-select-standard-label">Group Admin</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={props.adminName}
                            onChange={handleAdmin}
                            // input={<OutlinedInput label="Tag" />}
                            // renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                        {props.personName.map((user) => (
                            <MenuItem key={user} value={user} name={user}>
                                <ListItemText primary={user} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* <Autocomplete
                    sx={{ m: 1, width: 500 }}
                    multiple
                    options={names}
                    getOptionLabel={(option) => option}
                    disableCloseOnSelect
                    renderInput={(params) => {
                        console.log(params)
                        return (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Multiple Autocomplete"
                            placeholder="Multiple Autocomplete"
                        />
                    )}}
                /> */}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {props.handleAddButtonClick(); props.handleAddButtonClick()}} appearance="primary">
                    {getCurrentState().formData._id ? "Update" : "Create"}
                </Button>
                <Button onClick={() => props.setFormModal(false)} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state
}) 

const mapDispatchToProps = dispatch => ({
    setProps : (payload) => dispatch(setProps(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupFormModal)
