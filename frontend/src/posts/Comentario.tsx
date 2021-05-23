import React from 'react';
import useGetFetch from '../useGetFetch';
import './Post.css'
import { Link } from 'react-router-dom';

interface ComentarioListProps {
    mainPost: any
    userId: any
}

const ComentarioList: React.JSXElementConstructor<ComentarioListProps> = ({ mainPost,userId }) => {

    const { data: comments } = useGetFetch(`${process.env.REACT_APP_BASEURL}/post/` + mainPost._id + "/comment");

    return (
        <div className="row card mt-md-4 mt-3">
            { comments &&
                comments.map((comment: any) => (
                    <div className="card-body px-3 py-3" key={comment._id}>
                        {comment.publisher.userId==userId && 
                            <Link to={"/cuenta"} className="custom-card" >
                                <p className="lead texto">{comment.publisher.userName}</p>
                            </Link>
                        }
                        {comment.publisher.userId!=userId && 
                            <Link to={"/perfil/" + comment.publisher.userId} className="custom-card" >
                                <p className="lead texto">{comment.publisher.userName}</p>
                            </Link>}
                        
                        <p className="lead texto">{new Date(comment.date).toLocaleDateString("es-ES")} {new Date(comment.date).getHours()}:{new Date(comment.date).getMinutes()}</p>
                        <p className="texto">{comment.body}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default ComentarioList;