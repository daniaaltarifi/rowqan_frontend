import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { API_URL } from "../App";
import { useUser } from "../Component/UserContext";
import '../Css/Auth.css'
function CashBack() {
  const lang = location.pathname.split("/")[1] || "en";
  const { userId } = useUser();
  const [system, setSystem] = useState("chalets"); // Default system to "chalets"
  const [wallet, setwallet] = useState([]);
  const [reservations, setReservations] = useState([]); // Store reservations data dynamically

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

  // Fetch data dynamically based on the selected system
  const getReservations = useCallback(async () => {
    let apiUrl;
    switch (system) {
      case "chalets":
        apiUrl = `${API_URL}/ReservationsChalets/reservationsByUserId/${userId}/${lang}`;
        break;
      default:
        apiUrl = `${API_URL}/ReservationsChalets/reservationsByUserId/${userId}/${lang}`;
    }

    try {
      const res = await axios.get(apiUrl);
      setReservations(res.data || []); // Dynamically set reservations based on the response
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  }, [system, lang, userId]);

  useEffect(() => {
    getwallet();
    getReservations();
  }, [system, lang, userId]);

  const excludedColumns = [
    "id",
    "user_id",
    "chalet_id",
    "right_time_id",
    "chalet.id",
    "chalets.reserve_price",
    "user",
    "right_time.id",
    "lang",   
  ];

  // Filter out unwanted columns and their values, including nested fields
  const filterColumns = (reserve) => {
    const filteredReserve = { ...reserve };
    // Iterate over each key in the excludedColumns array
    excludedColumns.forEach((col) => {
      const keys = col.split("."); // Split by '.' to handle nested fields (e.g., "chalets.reserve_price")
      if (keys.length === 1) {
        // Handle flat fields (e.g., "id")
        delete filteredReserve[keys[0]];
      } else if (keys.length === 2) {
        // Handle nested fields (e.g., "chalets.reserve_price")
        const parentKey = keys[0];
        const nestedKey = keys[1];
        if (
          filteredReserve[parentKey] &&
          filteredReserve[parentKey][nestedKey] !== undefined
        ) {
          delete filteredReserve[parentKey][nestedKey]; // Remove the nested field
        }
      }
    });

    return filteredReserve;
  };

  return (
    <>
      <div className="main_cont_cashback">
        {wallet.map((balance) => (
          <div className="cont_balance" key={balance.id}>
            <div className="d-flex">
              <h4>Total Balance:</h4>
              <h5 className="mt-1">{balance.total_balance} JOD</h5>
            </div>
            {/* <div className="d-flex">
              <h4>Reserved Balance:</h4>
              <h5 className="mt-1">{balance.reserved_balance} JOD</h5>
            </div> */}
            <div className="d-flex">
              <h4>Cashback Balance:</h4>
              <h5 className="mt-1">{balance.cashback_balance} JOD</h5>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-evenly align-items-center mt-5">
        <button className="Login-button" onClick={() => setSystem("chalets")}>
          Chalets
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
                    </th> // Dynamically render columns based on filtered data
                  )
                )}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reserve, index) => {
              const filteredReserve = filterColumns(reserve); // Filter out unwanted columns and values
              return (
                <tr key={reserve.id}>
                  <td>{index + 1}</td>
                  {Object.values(filteredReserve).map((value, index) => (
                    <td key={index}>
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default CashBack;
