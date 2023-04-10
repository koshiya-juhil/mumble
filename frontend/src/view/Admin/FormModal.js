import React from 'react'
import "rsuite/dist/rsuite.min.css";
// import 'rsuite/dist/styles/rsuite-default.css';
import { Button, Modal } from 'rsuite';
import { store } from '../..';
import { connect } from 'react-redux';
import { TextField } from '@mui/material';

const FormModal = (props) => {

    const getCurrentState = () => {
        return store.getState()
    }

    return (
        <div style={{
            display: 'block', width: 700, paddingLeft: 30
        }}>
        {/* <h4>React Suite Modal Component</h4>
        <Button onClick={open}> Open</Button> */}

        <Modal open={props.formModal} size="xs" onClose={() => props.setFormModal(false)}>
            <Modal.Header>
                <Modal.Title>{getCurrentState().formData._id ? "Update" : "Create"} User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TextField id="form-username" label="Username" variant="standard" style={{width: "100%", marginBottom: "10px"}} 
                    onBlur={(e) => props.handleFormData("input-text", "username", e.target.value)}
                    defaultValue={getCurrentState().formData.username}
                />
                <TextField id="form-email" label="Email" variant="standard" style={{width: "100%", marginBottom: "10px"}} 
                    onBlur={(e) => props.handleFormData("input-text", "email", e.target.value)}
                    defaultValue={getCurrentState().formData.email}
                />
                <TextField id="form-password" label="Password" variant="standard" style={{width: "100%", marginBottom: "10px"}} 
                    onBlur={(e) => props.handleFormData("input-text", "password", e.target.value)}
                    defaultValue={getCurrentState().formData.password}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.handleAddButtonClick()} appearance="primary">
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

export default connect(mapStateToProps)(FormModal)
