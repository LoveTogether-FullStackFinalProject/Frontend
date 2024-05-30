import apiClient, { CanceledError } from "./api-client"
import { ProductData } from '../components/product.tsx'

export { CanceledError }

const getProducts = () => {
    const abortController = new AbortController()
    const req = apiClient.get<ProductData[]>('/donation/donations', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }

}

export default { getProducts}


