export interface DonorData {
    firstName: string;
    lastName: string;
    email: string;
    password: number;
    phoneNumber: string;
    address: Date;
    rating: string;
   
  }
  
  interface DonorProps {
    donor: DonorData;
  }
  
  

  