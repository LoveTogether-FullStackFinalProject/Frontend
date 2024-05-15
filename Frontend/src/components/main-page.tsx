import {  useEffect, useState } from 'react';
import { ProductData } from './product.tsx';
import  dataService,{ CanceledError } from "../services/data-service";


    function MainPage() {
        const [posts, setPosts] = useState<ProductData[]>([])
        const [error, setError] = useState()
        useEffect(() => {
            const { req, abort } = dataService.getRequestedProducts()
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