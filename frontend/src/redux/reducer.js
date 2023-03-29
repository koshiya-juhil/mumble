const initialState = {
    userData : [],
    chatData : [],
    messageData : [],
    currentUser : {},
    selectedChat : {},
    notifications : [],
}

const reducer = (state = initialState, action) => {

    console.log(state)  
    console.log(action)

    switch(action.type) {
        case "setProps": 
            return {
                ...state,
                userData : action.payload.userData == undefined ? state.userData : action.payload.userData,
                chatData : action.payload.chatData == undefined ? state.chatData : action.payload.chatData,
                messageData : action.payload.messageData == undefined ? state.messageData : action.payload.messageData,
                currentUser : action.payload.currentUser == undefined ? state.currentUser : action.payload.currentUser,
                selectedChat : action.payload.selectedChat == undefined ? state.selectedChat : action.payload.selectedChat,
                notifications : action.payload.notifications == undefined ? state.notifications : action.payload.notifications,
            }
        
        default :
            return state
    }
}

export default reducer