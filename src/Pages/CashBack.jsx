import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { API_URL } from "../App";
import { useUser } from "../Component/UserContext";
import "../Css/Auth.css";
import { Col, Container, Row } from "react-bootstrap";
import userprofile from "../assets/account.png";
import RatingForm from "../Component/RatingForm";
import SocialMediaButtons from "../Component/SocialMediaButtons";
function CashBack() {
  const lang = location.pathname.split("/")[1] || "en";
  const { userId } = useUser();
  const [system, setSystem] = useState("chalets");
  const [wallet, setwallet] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone_number: "",
    country: "",
    password: "",
  });
  const [reservations, setReservations] = useState([]); 
  const [confirmPassword, setConfirmPassword] = useState(user.password); 
  const [message, setMessage] = useState({ messageValue: "", color: "" }); 

  const getwallet = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/Wallet/wallet/user/${userId}/${lang}`
      );
      setwallet(res.data.wallet);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  }, [lang, userId]);
  const getUserById = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/users/getUserById/${userId}/${lang}`
      );
      setUser({
        email: res.data?.email || "No Email Found",
        name: res.data?.name || "No Name Found",
        phone_number: res.data?.phone_number || "No Phone Number Found",
        country: res.data?.country || "No Country Found",
        password: res.data?.password || "No Password Found",
      });
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  }, [lang, userId]);
  
  const getReservations = useCallback(async () => {
    let apiUrl;
    switch (system) {
      case "chalets":
        apiUrl = `${API_URL}/payments/getPayments/${userId}`;
        break;
      default:
        apiUrl = `${API_URL}/payments/getPayments/${userId}`;
    }

    try {
      const res = await axios.get(apiUrl);
      setReservations(res.data || []); 
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  }, [system, lang, userId]);

  useEffect(() => {
    getwallet();
    getReservations();
    getUserById();
  }, [system, lang, userId]);

  const excludedColumns = [
    "id",
    "user_id",
    "createdAt",
    "reservation_id",
    "User",
    "Reservations_Chalet.id",
    "Reservations_Chalet.date",
    "Reservations_Chalet.status",
    "Reservations_Chalet.remaining_amount",
    "Reservations_Chalet.cashback",
  ];

 
  const filterColumns = (reserve) => {
    const filteredReserve = { ...reserve };
    
    excludedColumns.forEach((col) => {
      const keys = col.split("."); 
      if (keys.length === 1) {
        
        delete filteredReserve[keys[0]];
      } else if (keys.length === 2) {
        
        const parentKey = keys[0];
        const nestedKey = keys[1];
        if (
          filteredReserve[parentKey] &&
          filteredReserve[parentKey][nestedKey] !== undefined
        ) {
          delete filteredReserve[parentKey][nestedKey]; 
        }
      }
    });

    return filteredReserve;
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    
    if (user.password && confirmPassword && user.password !== confirmPassword) {
      setMessage({
        messageValue: "Passwords do not match",
        color: "red",
      });
      return; 
    }

    try {
       await axios.put(
        `${API_URL}/users/UpdateUser/${userId}`,
        user
      );
      setMessage({
        messageValue: "Successfully updated",
        color: "green",
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <div className="main_cont_cashback">
        <SocialMediaButtons/>
        <Container>
          <Row>
            <Col lg={5} md={12} sm={12}>
              <div className="profile-bg container">
                <div className="content">
                  <img src={userprofile} />
                  <p>
                    <h3 className="profile_data">{user.name}</h3>
                  </p>
                  <p>{user.email}</p>
                  <p> Phone Number : {user.phone_number}</p>
                  <p>Country :{user.country}</p>
                </div>
              </div>
            </Col>
            <Col lg={7} md={12} sm={12}>
              <div className="cont_balance">
                {wallet.length > 0 ? (
                  wallet.map((balance) => (
                    <div key={balance.id}>
                      <div className="d-flex">
                        <h4>{lang === 'ar' ? ' الرصيد الكلي:':'Total Balance:'}</h4>
                        <h5 className="mt-1">{balance.total_balance} JOD</h5>
                      </div>
                      <div className="d-flex">
                        <h4>{lang === 'ar' ? ' رصيد الاسترداد النقدي:':'Cashback Balance:'}</h4>
                        <h5 className="mt-1">{balance.cashback_balance} JOD</h5>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h5>No cashback balance found.</h5>
                  </div>
                )}
                <form onSubmit={handleUpdateUser}>
                  {/* <Container className="text-center mt-4"> */}
                  <Row className="text-center mt-4">
                    <Col lg={6} md={12} sm={12}>
                      <input
                        type="text"
                        className="input_profile"
                        placeholder="name"
                        value={user.name}
                        onChange={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col lg={6} md={12} sm={12}>
                      <input
                        type="text"
                        className="input_profile"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col lg={6} md={12} sm={12}>
                      <input
                        type="number"
                        className="input_profile"
                        placeholder="phone_number"
                        value={user.phone_number}
                        onChange={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col lg={6} md={12} sm={12}>
                      <input
                        type="text"
                        className="input_profile"
                        placeholder="Country"
                        value={user.country}
                        onChange={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col lg={6} md={12} sm={12}>
                      <input
                        type="password"
                        className="input_profile"
                        placeholder="Password"
                        // value={user.password}
                        onChange={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col lg={6} md={12} sm={12}>
                      <input
                        type="password"
                        className="input_profile"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Col>
                  </Row>
                  {message.messageValue && (
                    <p style={{ color: message.color, textAlign: "center" }}>
                      {message.messageValue}
                    </p>
                  )}
                  <div className="d-flex justify-content-center align-items-center">
                    <button className="Login-button">Submit</button>
                  </div>
                  {/* </Container> */}
                </form>
              </div>{" "}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="d-flex justify-content-evenly align-items-center mt-5">
        <button className="Login-button" onClick={() => setSystem("chalets")}>
           {lang === 'ar' ? ' الشاليهات':'Chalets'}
        </button>
        {/* <button className="Login-button" onClick={() => setSystem("events")}>
          Events
        </button>
        <button className="Login-button" onClick={() => setSystem("lands")}>
          Lands
        </button> */}
      </div>
      <div className="table_cont m-5">
        <Table responsive>
          <thead>
            <tr>
              <th style={{ backgroundColor: "#F2C79D" }}>#</th>
              {reservations.length > 0 &&
                Object.keys(filterColumns(reservations[0])).map(
                  (col, index) => (
                    <th style={{ backgroundColor: "#F2C79D" }} key={index}>
                      {col}
                    </th> 
                  )
                )}
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reserve, index) => {
                const filteredReserve = filterColumns(reserve); 
                return (
                  <tr key={reserve.id} >
                    <td >{index + 1}</td>
                    {Object.entries(filteredReserve).map(
                      ([key, value], index) => {
                        // Check if the column is the 'date' column and format it
                        if (
                          key === "updatedAt" &&
                          value &&
                          !isNaN(new Date(value).getTime())
                        ) {
                          const formattedDate = new Date(
                            value
                          ).toLocaleDateString("en-GB"); // Format the date
                          return <td key={index}>{formattedDate}</td>;
                        }

                        // Check if the value is an object and render it as a list
                        if (typeof value === "object" && value !== null) {
                          return (
                            <td key={index}>
                              <ul>
                                {Object.entries(value).map(
                                  ([subKey, subValue], subIndex) => (
                                    <li  key={subIndex}>
                                      <strong>{subKey}: </strong>
                                      {typeof subValue === "object"
                                        ? JSON.stringify(subValue) // Handle nested objects
                                        : subValue}
                                    </li>
                                  )
                                )}
                              </ul>
                            </td>
                          );
                        }

                        // For all other values, display them as is
                        return <td key={index}>{value}</td>;
                      }
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="text-center" colSpan="5">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <RatingForm/>
      </div>
    </>
  );
}

export default CashBack;
