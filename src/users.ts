import {trimStr} from "./utils";

export type Userstype = {
    name: string,
    room: string
}
let users = [] as Userstype[]

export const findUser = (user: Userstype) => {
    const userName = trimStr(user.name)
    const userRoom = trimStr(user.room)
    return users.find(u => trimStr(u.name) === userName && trimStr(u.room) === userRoom)
}
export const addUser = (user: Userstype) => {
    const isExist = findUser(user)
    console.log("users", users)
    !isExist && users.push(user)// если юзера не сущ то добавить в users

    const currentUser = isExist || user
    return {isExist: !!isExist, user: currentUser}
}
export const getRoomsUsers=(room: string)=>{
 return users.filter(u=>u.room===room)
}
export const removeUser=(user: Userstype)=>{
    const foundUser=findUser(user)
    if (foundUser){
        users=users.filter(u=>foundUser.room && u.name!==foundUser.name )
    }
    return foundUser
}