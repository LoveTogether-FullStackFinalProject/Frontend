// import React, { useState, useEffect, useCallback } from 'react';
// //import {  useNavigate } from 'react-router-dom';
// import dataService, { CanceledError } from '../services/data-service';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Profile.css';
// import { Donation } from './donation';
// import { DonorData } from './donorData';
// import DonationModal from './DonationModal';
// import { Avatar } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const Profile: React.FC = () => {
//     const [user, setUser] = useState<DonorData | null>(null);
//     const [donations, setDonations] = useState<Donation[]>([]);
//     const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
//     const [loading, setLoading] = useState(true);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [error, setError] = useState<string | undefined>(undefined);
//     const [itemsToShow, setItemsToShow] = useState(4);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [editMode, setEditMode] = useState(false); // To toggle edit mode
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [editableUser, setEditableUser] = useState<Partial<DonorData>>({}); // To store the editable user data
//      // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [showSuccessBanner, setShowSuccessBanner] = useState(false); // To show the success banner
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [editDonationId, setEditDonationId] = useState<string | null>(null);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [editableDonation, setEditableDonation] = useState<Partial<Donation>>({});
//     const [showModal, setShowModal] = useState(false);
//      // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedFilters, setSelectedFilters] = useState<{ status: string[]; approved: string[] }>({ status: [], approved: [] });
//      // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [sortOption, setSortOption] = useState('newest');
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const navigate = useNavigate();
//     const userId = localStorage.getItem('userID');

//     const fetchData = useCallback(async () => {
//         try {
//             const { req: userReq } = dataService.getUser(userId!);
//             const userResponse = await userReq;
//             setUser(userResponse.data);

//             const { req: donationsReq } = dataService.getDonationsByUser(userId!);
//             const donationsResponse = await donationsReq;
//             setDonations(donationsResponse.data);
//             setFilteredDonations(donationsResponse.data); // Initialize with all donations
//         } catch (error) {
//             if (error instanceof CanceledError) return;
//             console.error('Error fetching data:', error);

//             // // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             // if ((error as any).response) {
//             //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             //     if ((error as any).response.status === 404) {
//             //         setDonations([]);
//             //     } else {
//             //         console.error('Server responded with:', (error as Error).response.status, (error as Error).response.data);
//             //         setError(`Error fetching data: ${error.response.status} - ${error.response.data}`);
//             //     }
//             // } else if (error.request) {
//             //     console.error('No response received:', error.request);
//             //     setError('Error fetching data: No response received from server');
//             // } else {
//             //     console.error('Error setting up request:', error.message);
//             //     setError(`Error fetching data: ${error.message}`);
//             // }
//         } finally {
//             setLoading(false);
//         }
//     }, [userId]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     useEffect(() => {
//         applyFilters();
//     }, [donations, searchQuery, selectedFilters, itemsToShow]);

//    const applyFilters = () => {
//     let filtered = donations;

//     if (searchQuery) {
//         filtered = filtered.filter(donation =>
//             donation.itemName.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     }

//     if (selectedFilters.status.length > 0) {
//         filtered = filtered.filter(donation =>
//             selectedFilters.status.includes(donation.status)
//         );
//     }

//     if (selectedFilters.approved.length > 0) {
//         filtered = filtered.filter(donation =>
//             selectedFilters.approved.includes(String(donation.approvedByAdmin))
//         );
//     }

//     setFilteredDonations(filtered.slice(0, itemsToShow));
// };

//     const handleShowMoreClick = () => {
//         setItemsToShow(itemsToShow + 4);
//     };

//     const toggleFilter = (type: 'status' | 'approved', value: string) => {
//         setSelectedFilters(prevFilters => {
//             const newFilters = { ...prevFilters };
//             if (newFilters[type].includes(value)) {
//                 newFilters[type] = newFilters[type].filter(f => f !== value);
//             } else {
//                 newFilters[type].push(value);
//             }
//             return newFilters;
//         });
//     };

//     const removeFilter = (type: 'status' | 'approved', value: string) => {
//         setSelectedFilters(prevFilters => {
//             const newFilters = { ...prevFilters };
//             newFilters[type] = newFilters[type].filter(f => f !== value);
//             return newFilters;
//         });
//     };

//     const handleDeleteClick = async (donationId: string) => {
//         try {
//             await dataService.deleteDonation(donationId);
//             setDonations(donations.filter((donation) => donation._id !== donationId));
//         } catch (error) {
//             console.error('Error deleting donation:', error);
//             setError('Error deleting donation');
//         }
//     };

//     const handleEditClick = (donation: Donation) => {
//         setEditDonationId(donation._id);
//         setEditableDonation(donation);
//         setShowModal(true);
//     };

//     // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     //     const { name, value } = e.target;
//     //     setEditableDonation((prev) => ({ ...prev, [name]: value }));
//     // };

//     // const handleSaveClick = async () => {
//     //     try {
//     //         await dataService.updateDonation(editDonationId!, editableDonation);
//     //         setDonations((prev) =>
//     //             prev.map((donation) =>
//     //                 donation._id === editDonationId ? { ...donation, ...editableDonation } : donation
//     //             )
//     //         );
//     //         setEditDonationId(null);
//     //         setEditableDonation({});
//     //         setShowModal(false);
//     //     } catch (error) {
//     //         console.error('Error updating donation:', error);
//     //     }
//     // };

//     const handleCancelClick = () => {
//         setEditDonationId(null);
//         setEditableDonation({});
//         setShowModal(false);
//     };

//     const getStatusClass = (status: string) => {
//         switch (status) {
//             case 'ממתין לאיסוף מבית התורם':
//                 return 'status-awaiting-pickup';
//             case 'נמסר בעמותה':
//                 return 'status-delivered-to-charity';
//             case 'ממתין לאיסוף':
//                 return 'status-awaiting-collection';
//             case 'נמסר':
//                 return 'status-delivered';
//             default:
//                 return '';
//         }
//     };

//     // const handleCardClick = (donation: Donation) => {
//     //     setSelectedDonation(donation);
//     //     setShowModal(true);
//     // };

//     // const handleSaveChanges = async () => {
//     //     try {
//     //         if (user && editableUser) {
//     //             await dataService.updateUserData(user._id, editableUser);
//     //             setUser({ ...user, ...editableUser }); // Update user state with new details
//     //             setEditMode(false);
//     //             setShowSuccessBanner(true);
//     //             setTimeout(() => setShowSuccessBanner(false), 3000); // Hide banner after 3 seconds
//     //         }
//     //     } catch (error) {
//     //         console.error('Error saving user details:', error);
//     //     }
//     // };

//     // const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     //     setSortOption(e.target.value);
//     //     const sortedDonations = [...donations].sort((a, b) => {
//     //         if (sortOption === 'newest') {
//     //             return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     //         } else if (sortOption === 'oldest') {
//     //             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
//     //         }
//     //         return 0;
//     //     });

//     //     setDonations(sortedDonations);
//     // };

//     if (loading) return <div className="loading">Loading...</div>;
//     //if (error) return <div className="loading">{error}</div>;
//     if (!user) return <div className="loading">User not found</div>;

//     return (
//         <div className="profile-page"> 
//             <div className="user-info">
//                 <Avatar className='Avatar-profile' alt="Remy Sharp" src={user.image} />
//                 <span className='profile-header'>שלום, {user.firstName} {user.lastName}</span>
//             </div>
//             <main className="profile-content">
//                 <div className="rating-status" style={{ direction: "rtl" }}>
//                     דירוג משתמש: {user.rating ?? 0}
//                 </div>
//                 <div className="my-donations-title">
//                       התרומות שלי
//                  </div>

//                 <div className="search-bar">
//                     <input 
//                         className='search-input'
//                         type="text" 
//                         placeholder="חפש תרומה..." 
//                         value={searchQuery} 
//                         onChange={(e) => setSearchQuery(e.target.value)} 
//                     />
//                 </div>
//                 <div className="filter-section">
//                 <h4>בחר מסננים:</h4>
//                 <div className="filter-buttons">
//                     {['ממתין לאיסוף מבית התורם', 'נמסר בעמותה', 'ממתין לאיסוף', 'נמסר'].map(status => (
//                         <button
//                             key={status}
//                             onClick={() => toggleFilter('status', status)}
//                             className={selectedFilters.status.includes(status) ? 'active' : ''}
//                         >
//                             {status}
//                         </button>
//                     ))}
//                     <button
//                         onClick={() => toggleFilter('approved', 'true')}
//                         className={selectedFilters.approved.includes('true') ? 'active' : ''}
//                     >
//                         מאושר
//                     </button>
//                     <button
//                         onClick={() => toggleFilter('approved', 'false')}
//                         className={selectedFilters.approved.includes('false') ? 'active' : ''}
//                     >
//                         לא מאושר
//                     </button>
//                 </div>
//                 </div>


//                 <div className="selected-filters">
//                     {selectedFilters.status.map(filter => (
//                         <span key={filter} onClick={() => removeFilter('status', filter)}>
//                             {filter} ✖
//                         </span>
//                     ))}
//                     {selectedFilters.approved.map(filter => (
//                         <span key={filter} onClick={() => removeFilter('approved', filter)}>
//                             {filter === 'true' ? 'מאושר' : 'לא מאושר'} ✖
//                         </span>
//                     ))}
//                 </div>

//                 <div className="donations-list">
//                     {filteredDonations.length > 0 ? (
//                         filteredDonations.map((donation) => (
//                             <div
//                                 key={donation._id}
//                                 className={`donation-card ${getStatusClass(donation.status)}`}
//                                 //onClick={() => handleCardClick(donation)}
//                             >
//                                 <img src={donation.image} alt={donation.itemName} />
//                                 <h5>{donation.itemName}</h5>
//                                 <p>סטטוס: {donation.status}</p>
//                                 <p>אושר על ידי מנהל: {donation.approvedByAdmin === 'true' ? "כן" : "לא"}</p>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="no-donations-container">
//                             <p>לא נמצאו תרומות</p>
//                         </div>
//                     )}
//                 </div>
//                 {donations.length > itemsToShow && (
//     <button className="show-more" onClick={handleShowMoreClick}>
//         הצג עוד
//     </button>
// )}
//             </main>

//             <DonationModal

//                 show={showModal}
//                 onHide={handleCancelClick}
//                 donation={selectedDonation}
//                 onEditClick={handleEditClick}
//                 onDeleteClick={handleDeleteClick}
//             /> 
//         </div>
//     );
// };

// export default Profile;
