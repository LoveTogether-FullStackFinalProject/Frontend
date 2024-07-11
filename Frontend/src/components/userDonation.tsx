export interface userDonation {
  _id: string;
  itemName: string;
  quantity: number;
  category: string;
  condition: string;
  expirationDate: Date;
  description: string;
  pickupAddress: string;
  donor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
  };
  status: string;
  approvedByAdmin?: string;
  image?: string;
}

export default userDonation;
