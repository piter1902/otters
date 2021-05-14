import { useEffect, useState } from "react";
import '../Navbar.css'
import { Link } from 'react-router-dom';
import './Post.css'
import PostListComponent from "./PostListComponent";
import Post from "./Post";
import useGetFetch from "../useGetFetch";
import { ClipLoader } from "react-spinners";

export interface PostListProps {

}

const PostList: React.JSXElementConstructor<PostListProps> = () => {

    const {data:posts, isPending, error} = useGetFetch(`${process.env.REACT_APP_BASEURL!}/post`);

    // Posts filtradas
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    // Filtro seleccionado
    const [filter, setFilter] = useState<string>("0");

    // Cambio del filtro a aplicar
    const filterChanged = (event: { target: { value: string; }; }) => {
        setFilter(event.target.value);
    }


    useEffect(() => {
        if (filter === "MostLiked") {
            setFilteredPosts(
                posts.sort((a: Post, b: Post) =>{
                    return +(b.possitive_valorations.length - b.negative_valorations.length)- +(a.possitive_valorations.length - a.negative_valorations.length)
                }
                ))
        }else if (filter === "MostCommented") {
            setFilteredPosts(
                posts.sort((a: Post, b: Post) =>{
                    return +b.comments.length - +a.comments.length
                }
                ))
        }  else if (filter === "Recent") {
            setFilteredPosts(
                posts.sort((a: Post, b: Post) =>{
                    return +new Date(b.date) - +new Date(a.date)
                }
                ))
        } else {
            setFilteredPosts(posts)
            setFilter("0")
        }
        return () => { }
    }, [filter, posts]);

    return (
        <div >
            <div className="container-fluid mb-4 mt-4">
                <div className="row justify-content-between">
                    <div className="col-4">
                        <Link to="/createPost" >
                            <button className="btn navbar-azul text-light text-decoration-none">
                                Añadir post <i className="fas fa-plus ms-2"></i>
                            </button>
                        </Link>
                    </div>
                    <div className="col-4 d-grid gap-2 justify-content-md-end">
                        <select id="petitionFilter" className="navbar-azul text-light btn form-select" value={filter} onChange={filterChanged}>
                            <option value="0" style={{ backgroundColor: "white" }} disabled>Filtrar</option>
                            <option value="Recent" className="text-dark" style={{ backgroundColor: "white" }}>Más reciente</option>
                            <option value="MostLiked" className="text-dark" style={{ backgroundColor: "white" }}>Más valorados</option>
                            <option value="MostCommented" className="text-dark" style={{ backgroundColor: "white" }}>Más comentados</option>
                            <option style={{ backgroundColor: "white", textAlign: "center" }} disabled value="">_______________</option>
                            <option value="Reset" className="text-dark" style={{ backgroundColor: "white" }}>Limpiar filtro</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* To show error on fetching data */}
            { error && <div style={{ textAlign: "center", verticalAlign: "middle" }}>{error}</div>}
            <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                <ClipLoader color="#172c48" loading={isPending} size={50} />
            </div>
            <div className="container">
                {/* {data && setPetitions(data)} */}
                {isPending ? <div style={{ textAlign: "center", verticalAlign: "middle" }}>Loading ...</div>
                    : <PostListComponent posts={filteredPosts} />}
            </div>
        </div>
    );
}

export default PostList;