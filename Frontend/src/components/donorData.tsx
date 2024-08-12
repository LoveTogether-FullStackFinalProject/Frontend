

export interface DonorData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Assuming passwords are stored as strings
  phoneNumber: string;
  address: string; // Address should be a string
  rating: string;
  isAdmin: boolean;
  isPublished?: boolean;
  image: string;

  

}

interface DonorProps {
  donor: DonorData;
}

const Donor = ({ donor }: DonorProps) => {
  return (
    <div className="donor-details">
      <p>שם פרטי: {donor.firstName}</p>
      <p>שם משפחה: {donor.lastName}</p>
      <p>אימייל: {donor.email}</p>
      <p>מספר טלפון: {donor.phoneNumber}</p>
      <p>כתובת: {donor.address}</p>
      <p>דירוג: {donor.rating}</p>
      <p>תמונה: {donor.image}</p>
    </div>
  );
};

export default Donor;
