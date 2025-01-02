// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { API_URL } from '../App';

// function Playgrounds() {
//     const getUserId = async () => {
//         try {
//           const response = await axios.get(`${API_URL}/users/verifytoken`, {
//             withCredentials: true, 
//           });
      
//           console.log("User ID:", response.data.userId);
//         } catch (error) {
//           console.error("Error fetching user ID:", error);
//         }
//       };
      
//   useEffect(() => {
//     getUserId();
//   }, []);

//   return (
//     <div>Playgrounds</div>
//   );
// }

// export default Playgrounds;
import ChatNowHeader from '../Component/ChatNowHeader';
import { useUser } from '../Component/UserContext';
function Playgrounds() {
    const { userId } = useUser();
    console.log("first user:", userId);
  return (
    <div>
      <ChatNowHeader/>
      
    </div>
  )
}

export default Playgrounds