import {  useEffect, useState } from 'react';
//import { PostData } from '../Post';
//import postService, { CanceledError } from "../services/post-service";


    function MainPage() {
        const [posts, setPosts] = useState<PostData[]>([])
        const [error, setError] = useState()
        useEffect(() => {
            const { req, abort } = postService.getAllPosts()
            req.then((res) => {
                setPosts(res.data)
            }).catch((err) => {
                console.log(err)
                if (err instanceof CanceledError) return
                setError(err.message)
            })
            return () => {
                abort()
            }
        }, [])
    
        return (
            <>
               
    
                {error && <p className='text-danger'>{error}</p>}
                {posts.map((post, index) =>
                    <div className="p-4" key={index}>
                        <Post post={post} />
                    </div>
                )}
            </>
    
        )
    }
    
    export default MainPage