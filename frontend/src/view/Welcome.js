import 'bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Button } from 'react-bootstrap'
import NavigationBar from '../components/NavigationBar'

function Welcome() {
    return (
        <>
            <NavigationBar />
            
            <Row>
                <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                    <div>
                        <h1>Share the world with your friends</h1>
                        <p>Chat App lets you connect with the world</p>
                        <Button variant='success'>
                            Get Started <i className='fas fa-comments home-message-icon'></i>
                        </Button>
                    </div>
                </Col>
                <Col md={6} className="welcome__bg"></Col>
            </Row>
        </>
    )
}

export default Welcome
