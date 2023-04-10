import React from 'react'
import NavigationBar from '../../components/NavigationBar'
import PersonIcon from '@mui/icons-material/Person'
import GroupsIcon from '@mui/icons-material/Groups'
import { useState } from 'react'

function AdminHome() {

  const [selectedTab, setSelectedTab] = useState()

  return (
    <>
        {/* <NavigationBar />
        <div>
          <div className='sidebar'>
            <div className='sidebar-center'>
              <ul>
                <li>
                  <PersonIcon />
                  <span>Users</span>
                </li>
                <li>
                  <GroupsIcon />
                  <span>Groups</span>
                </li>
              </ul>
            </div>
          </div>
        </div> */}
    </>
  )
}

export default AdminHome