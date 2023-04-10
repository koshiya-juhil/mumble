import TagIcon from '@mui/icons-material/Tag';
import { MenuItem, Select } from '@mui/material';

export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {
            params.row.isAvatarImageSet == true ? 
            <img className="cellImg" src={`data:image/svg+xml;base64,${params.row.avatarImage}`} alt="avatar" />
            :
            <img className="cellImg" src={params.row.avatarImage} alt="avatar" />
          }
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  // {
  //   field: "age",
  //   headerName: "Age",
  //   width: 100,
  // },
  // {
  //   field: "status",
  //   headerName: "Status",
  //   width: 160,
  //   renderCell: (params) => {
  //     return (
  //       <div className={`cellWithStatus ${params.row.status}`}>
  //         {params.row.status}
  //       </div>
  //     );
  //   },
  // },
];

export const groupColumns = [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "groupname",
    headerName: "Group Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <TagIcon></TagIcon> */}
          {params.row.chatName}
        </div>
      );
    },
  },
  {
    field: "users",
    headerName: "Users",
    width: 230,
    renderCell: (params) => {
      return (
        <Select value={params.row.users[0].username} >
          {
            params.row.users.map((user,index) => (
              <MenuItem key={index} value={user.username} >
                {/* {user.username} */}
                <div className="cellWithImg">
                  {
                    user.isAvatarImageSet == true ? 
                    <img className="cellImg" src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatar" />
                    :
                    <img className="cellImg" src={user.avatarImage} alt="avatar" />
                  }
                  {user.username}
                </div>
              </MenuItem>
            ))
          }
        </Select>
      )
    }
  },
  {
    field: "groupadmin",
    headerName: "Group Admin",
    width: 230,
    renderCell: (params) => {
      return (
        // <div>{params.row.groupAdmin[0].username}</div>
        <div className="cellWithImg">
          {
            params.row.groupAdmin[0].isAvatarImageSet == true ? 
            <img className="cellImg" src={`data:image/svg+xml;base64,${params.row.groupAdmin[0].avatarImage}`} alt="avatar" />
            :
            <img className="cellImg" src={params.row.groupAdmin[0].avatarImage} alt="avatar" />
          }
          {params.row.groupAdmin[0].username}
        </div>
        
      )
    }
  },
]
