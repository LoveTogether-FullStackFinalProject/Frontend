interface User {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    rating: string;
  }

export interface Donation{
  _id: string;
  category: string;
  productType: string; 
  amount: number;
  itemCondition: string;
  expirationDate: Date;
  description: string;
  pickUpAddress: string;
  donor: User;
  status: string; 
  approvedByAdmin?: string; 
}

interface DonationProps {
    donation: Donation
}

function Donation({ donation }: DonationProps) {
    return (
    <div>
        <p>Category: {donation.category}</p>
        <p>Donation Type: {donation.productType}</p>
        <p>Amount: {donation.amount}</p>
        <p>Item Condition: {donation.itemCondition}</p>
        <p>Description: {donation.description}</p>
        <p>Pick Up Address: {donation.pickUpAddress}</p>
        <p>Donor name: {donation.donor.firstName}</p>
        <p>Status: {donation.status}</p>
        <p>Approved by admin: {donation.approvedByAdmin}</p>
    </div>
    )
}

export default Donation