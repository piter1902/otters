interface UserInfo {
    userId: string;
    userName: string;
}

interface Post {
    _id: string,
    title: string,
    body: string,
    userInfo: UserInfo,
    date: Date,
    comments: [],
    possitive_valorations: [string],
    negative_valorations: [string],
}

export default Post;