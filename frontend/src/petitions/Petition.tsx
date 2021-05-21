interface UserInfo {
    userId: string;
    userName: string;
}

interface Petition {
    _id: string,
    title: string,
    body: string,
    userInfo: UserInfo,
    creationDate: Date,
    targetDate: Date,
    place: string,
    isUrgent: boolean,
    status: string,
    expTime: string,
    userIdAsigned: string
}

export default Petition;