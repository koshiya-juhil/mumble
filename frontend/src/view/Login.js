import { useState } from "react"
import { Container, Form, Button, Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import { IISMethods, JsCall } from "../config/IISMethods"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { loginRoute } from "../utils/APIRoutes"
import NavigationBar from "../components/NavigationBar"

function Login() {

    const navigate = useNavigate()

    const [state, setState] = useState({
        loginFormData: {
            username: "",
            password: "",
            rememberme: false
        },
        loginValidations: [{
            formfields: [
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

    const handleloginFormData = (type, key, value) => {
        state.loginFormData[key] = value
    }

    const generateError = (err) => {
        toast.error(err, {
            position: "bottom-right"
        })
    }

    const LogIn = async (e) => {
        e.preventDefault()
        // console.log(state.loginFormData)

        // JsCall.validateForm(state.loginFormData, state.loginValidations)

        if(state.loginFormData.username && state.loginFormData.password){
            try {
                const { data } = await axios.post(loginRoute, {
                    ...state.loginFormData,
                })
                // console.log("data",data)
    
                if(data.status === false){
                    generateError(data.msg)
                }
    
                if(data.status === true){
                    localStorage.setItem("chat-app-user", JSON.stringify(data.user))
                    // console.log("###",data.user)
                    if(data.user.avatarImage){
                        navigate("/home")
                    }
                    else {
                        navigate("/setavatar")
                    }
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
        // <Container className="bg-dark">
        <>
            <NavigationBar />
            <Row className="">
                <Col md={6} className="login__bg"></Col>
                <Col md={6} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{width: "80%", maxWidth: 500}}>
                        <h1 className="d-flex justify-content-center">Log in</h1>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control onChange={(e) => handleloginFormData("text","username",e.target.value)} type="text" id="form-username" placeholder="Enter username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={(e) => handleloginFormData("text","password",e.target.value)} id="form-password" type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check onChange={(e) => handleloginFormData("checkbox","rememberme",e.target.checked)} type="checkbox" label="Remember me" />
                        </Form.Group>
                        <Button onClick={(e) => LogIn(e)} variant="primary" type="submit" style={{width: "100%"}}>
                            Login
                        </Button>

                        <div className="py-4">
                            <p className="text-center">
                                Don't have an account ? <Link to="/signup">Sign Up</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
                <ToastContainer></ToastContainer>
            </Row>
        </>
        // </Container>
    )
}

export default Login