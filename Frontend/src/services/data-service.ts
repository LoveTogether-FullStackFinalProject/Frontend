import apiClient, { CanceledError } from "./api-client"
import { ProductData } from '../components/product.tsx'

export { CanceledError }

const getRequestedProducts = () => {
    const abortController = new AbortController()
    const req = apiClient.get<ProductData[]>('api/product', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }

}

export default { getRequestedProducts}


