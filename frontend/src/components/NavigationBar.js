import { useEffect, useState } from 'react'
import { Nav, Container, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { connect } from 'react-redux'
import { store } from '../index'
import { setProps } from '../redux/action'

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Menu, MenuItem } from '@mui/material';
import logo from '../assets/mumble.png'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

function NavigationBar(props) {

  const [pagename, setPagename] = useState()
  const [currentUser, setCurrentUser] = useState()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const getCurrentState = () => {
    return store.getState()
  }

  useEffect(() => {
    async function runUseEffect(){
      setPagename(window.location.pathname.slice(1))
      setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')))
    }
    runUseEffect()
  }, [])
  

  const logOut = () => {
    localStorage.removeItem('chat-app-user')
  }

  const redirectToChat = async (chat, data) => {
    await props.setProps({selectedChat : chat})
    await props.setProps({notifications : getCurrentState().notifications.filter(n => n !== data)})
  } 

  return (
    <Navbar bg="dark" variant='dark' expand="lg">
      <Container fluid>
        <Container>
          <Navbar.Brand href="/home">
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
          </Navbar.Brand>
          <Navbar.Brand className='brand-name' href="/mumbleai">MumbleAI 
            {/* <ArrowOutwardIcon style={{fontSize: "12px", marginBottom: "15px", marginLeft: "-6px"}}></ArrowOutwardIcon>  */}
          </Navbar.Brand>
        </Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {
              pagename == "admin" ? <></> :
              <div className='d-flex align-items-center' style={{color : "white", marginRight: "10px"}}>
                <Badge color="secondary" badgeContent={getCurrentState().notifications.length}>
                  <NotificationsNoneIcon onClick={(e) => setAnchorEl(e.currentTarget)} style={{cursor: "pointer"}}></NotificationsNoneIcon>
                </Badge>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  onClick={() => setAnchorEl(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {
                    !getCurrentState().notifications.length ?
                      <MenuItem>
                        No Messages
                      </MenuItem>
                    : 
                    getCurrentState().notifications.map((data) => (
                      <MenuItem key={data._id} onClick={(e) => {e.preventDefault(); redirectToChat(data.chatid, data)}}>
                        {
                          data.chatid.isGroupChat ?
                          `New Message in ${data.chatid.chatName}`
                          : `New Message from ${data.sender.username}`
                        }
                      </MenuItem>
                    ))
                  }
                </Menu>
              </div>
            }
            {
              pagename == 'admin' ? <></> : 
              pagename == '' || pagename == 'signup' || pagename == 'login'
              ?
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              :
              <>
                <NavDropdown 
                  title={<>
                    <img src={`data:image/svg+xml;base64,${currentUser?.avatarImage}`} style={{ width: 30, height: 30, marginRight: 10, objectFit: "cover", borderRadius: "50%" }} />
                    {currentUser?.username}
                    </>
                  }
                  id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">
                    <LinkContainer to="/login" onClick={() => logOut()}>
                      <Nav.Link className='c-black'>LogOut</Nav.Link>
                    </LinkContainer>
                  </NavDropdown.Item>
                </NavDropdown>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const mapStateToProps = state => ({
  ...state
}) 

const mapDispatchToProps = dispatch => ({
  setProps : (payload) => dispatch(setProps(payload))
})


export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar)