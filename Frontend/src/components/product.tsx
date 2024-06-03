export interface ProductData {
    _id: string;
    category: string;
    productType: string;
    amount: number;
    itemCondition: string;
    expirationDate: Date;
    description: string;
    pickUpAddress: string;
    status: string;
  }
  
  interface ProductProps {
    product: ProductData;
  }
  
  function Product({ product }: ProductProps) {
    return (
      <div>
        <p>Category: {product.category}</p>
        <p>Product Type: {product.productType}</p>
        <p>Amount: {product.amount}</p>
        <p>Item Condition: {product.itemCondition}</p>
        <p>Description: {product.description}</p>
        <p>Pick Up Address: {product.pickUpAddress}</p>
      </div>
    );
  }
  
  export default Product;
  