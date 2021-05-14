import React from 'react';
import useGetFetch from '../useGetFetch';
import './Post.css'

interface ComentarioListProps {
    mainPost: any
}

const ComentarioList: React.JSXElementConstructor<ComentarioListProps> = ({ mainPost }) => {

    const { data: comments } = useGetFetch(`${process.env.REACT_APP_BASEURL}/post/` + mainPost._id + "/comment");

    return (
        <div className="row card mt-md-4 mt-3">
            { comments &&
                comments.map((comment: any) => (
                    <div className="card-body px-3 py-3" key={comment._id}>
                        <p className="lead texto">{comment.publisher.userName}</p>
                        <p className="lead texto">{new Date(comment.date).toLocaleDateString("es-ES")}</p>
                        <p className="texto">{comment.body}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default ComentarioList;