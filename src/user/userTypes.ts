export interface User {
    _id: string,   //in mongoDB the id field is used as '_id'
    name: string,
    email: string,
    password: string,
}