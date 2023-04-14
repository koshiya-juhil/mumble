import { Container, Form, Button, Col, Row } from "react-bootstrap"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { signupRoute } from "../utils/APIRoutes"
import NavigationBar from "../components/NavigationBar"

const Signup = () => {

    const navigate = useNavigate()

    const [state, setState] = useState({
        signupFormData: {
            email: "",
            username: "",
            password: "",
            // confirmpassword: ""
        },
        signupValidations: [{
            formfields: [
                {
                    field: "email",
                    type: "text",
                    required: true,
                    defaultVisibility: true,
                },
                {
                    field: "username",
                    type: "text",
                    required: true,
                    defaultVisibility: true
                },
                {
                    field: "password",
                    type: "text",
                    required: true,
                    defaultVisibility: true
                },
            ]
        }]
    })

    const handlesignupFormData = (type, key, value) => {
        state.signupFormData[key] = value
    }

    const generateError = (err) => {
        toast.error(err, {
            position: "bottom-right"
        })
    }

    const SignUp = async (e) => {
        e.preventDefault()
        // console.log(state.signupFormData)

        // JsCall.validateForm(state.loginFormData, state.loginValidations)

        if(state.signupFormData.email && state.signupFormData.username && state.signupFormData.password){
            try {
                const { data } = await axios.post(signupRoute, {
                    ...state.signupFormData,
                })
                // console.log("data",data)
    
                if(data.state === false){
                    generateError(data.msg)
                }
    
                if(data.status === true){
                    localStorage.setItem("chat-app-user", JSON.stringify(data.user))
                    navigate("/setavatar")
                }
    
            } catch (error) {
                console.log(error)
            }
        }
        else {
            generateError("Fill Required Data")
        }

    }

    return(
        // <Container>
        <>
            <NavigationBar />
            <Row className="">
                <Col md={6} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{width: "80%", maxWidth: 500}}>
                        <h1 className="d-flex justify-content-center">Sign Up</h1>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={(e) => handlesignupFormData("text","email",e.target.value)} type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control onChange={(e) => handlesignupFormData("text","username",e.target.value)} type="text" placeholder="Enter username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={(e) => handlesignupFormData("text","password",e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>
                        {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control onChange={(e) => handlesignupFormData("text","confirmpassword",e.target.value)} type="password" placeholder="Confirm Password" />
                        </Form.Group> */}
                        <Button variant="primary" type="submit" onClick={(e) => SignUp(e)} style={{width: "100%"}}>
                            Sign Up
                        </Button>

                        <div className="py-4">
                            <p className="text-center">
                                Already have an account ? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
                <Col md={6} className="login__bg"></Col>
                <ToastContainer></ToastContainer>
            </Row>
        </>
        // </Container>
    )
}

export default Signup