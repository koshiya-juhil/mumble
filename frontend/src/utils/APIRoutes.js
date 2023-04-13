export const host = "http://localhost:4000"

export const signupRoute = `${host}/signup`
export const loginRoute = `${host}/login`
export const setAvatarRoute = `${host}/setavatar`
export const allUsersRoute = `${host}/allusers`
export const sendMessageRoute = `${host}/messages/addmsg`
export const getAllMessagesRoute = `${host}/messages/getmsg`
export const createGroupRoute = `${host}/chat/group`
export const getChats = `${host}/chat/list`
export const getGroups = `${host}/chat/group/list`
export const renameGroup = `${host}/chat/group/rename`
export const addUserToGroup = `${host}/chat/group/add`
export const removeUserFromGroup = `${host}/chat/group/remove`
export const updateGroupUsers = `${host}/chat/group/update`
export const updateGroupInfo = `${host}/chat/group/updategroup`
export const deleteGroup = `${host}/chat/group/delete`

export const updateUser = `${host}/user/update`
export const deleteUser = `${host}/user/delete`

export const mumbleAI = `${host}/mumbleai`

export const accessChat = `${host}/chat`