interface User {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    rating: string;
    image: string;
  }

export interface Donation{
  _id: string;
  category: string;
  itemName: string; 
  quantity: number;
  condition: string;
  expirationDate: Date;
  description: string;
  pickUpAddress: string;
  branch: string;
  donor: User;
  status: string; 
  approvedByAdmin?: string; 
  image: string;
  createdAt: string;

}



interface DonationProps {
    donation: Donation
}

function Donation({ donation }: DonationProps) {
    return (
    <div>
        <p>Category: {donation.category}</p>
        <p>Donation Type: {donation.itemName}</p>
        <p>Amount: {donation.quantity}</p>
        <p>Item Condition: {donation.condition}</p>
        <p>Description: {donation.description}</p>
        <p>Pick Up Address: {donation.pickUpAddress}</p>
        <p>Branch: {donation.branch}</p>
        <p>Donor name: {donation.donor.firstName}</p>
        <p>Status: {donation.status}</p>
        <p>Approved by admin: {donation.approvedByAdmin}</p>
        <p>Image: {donation.image}</p>
    </div>
    )
}

export default Donation