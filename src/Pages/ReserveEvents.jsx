import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../App";
import ModelAlert from "../Component/ModelAlert";
import { useUser } from "../Component/UserContext";
import Form from "react-bootstrap/Form";

const ReservationEvents = () => {
  const { id } = useParams();
  const { userId } = useUser();
  const lang = useMemo(() => location.pathname.split("/")[1] || "en", []);
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [availableTime, setAvailableTime] = useState([]);
  const [plans, setPlans] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null); // Track the selected plan
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const fetchAvailableTime = useCallback(async () => {
    if (!selectedDate) return;
    try {
      const { data } = await axios.get(
        `${API_URL}/reservationsEvents/event-status/${selectedDate}/${id}`
      );
      setAvailableTime(data.availableDurations);
    } catch {
      console.error("Error fetching available times");
    }
  }, [selectedDate, id]);

  const fetchReservations = useCallback(async () => {
    try {
      const [reservationDateRes, plansRes] = await Promise.all([
        axios.get(
          `${API_URL}/reservationsEvents/getAllreservationeventsByAvailableId/${id}/${lang}`
        ),
        axios.get(`${API_URL}/plans/plans/event/${id}/${lang}`),
      ]);
      setReservations(reservationDateRes.data.fullyReservedDates || []);
      setPlans(plansRes.data.plans || []);
      setTotalPrice(plansRes.data.plans[0]?.Available_Event.price || 0);
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  }, [id, lang]);

  useEffect(() => {
    fetchReservations();
    fetchAvailableTime();
  }, [fetchReservations, fetchAvailableTime]);

  const handleChangeMonth = (offset) =>
    setDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );

  const handleSelectDate = (day) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
    setError("");
  };

  const isReserved = (day) => {
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    return reservations.includes(dateString);
  };

  const validateSelectDate = () => {
    if (!selectedDate) {
      setError("Please select a date first.");
      setShowOptions(false);
      return;
    }
    setError("");
    setShowOptions(true);
  };

  const daysInMonth = useMemo(
    () =>
      Array.from(
        {
          length: new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          ).getDate(),
        },
        (_, i) => i + 1
      ),
    [date]
  );

  // Handle Plan Selection
  const handleSelectPlan = (event) => {
    const selectedPlanId = event.target.value;
    const plan = plans.find((plan) => plan.id === Number(selectedPlanId));
    if (plan) {
      if (selectedPlan) {
        setTotalPrice((prevPrice) => prevPrice - selectedPlan.price); 
      }
      setTotalPrice((prevPrice) => prevPrice + plan.price);
      setSelectedPlan(plan);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return setError("Please select a date.");

    try {
      await axios.post(
        `${API_URL}/reservationsEvents/createreservationevents`,
        {
          date: selectedDate,
          Duration:duration,
          lang,
          price:totalPrice,
          available_event_id: id,
          user_id: userId,
          plan_id:selectedPlan
        }
      );

      setModalTitle("Success");
      setModalMessage("Your reservation has been successfully booked!");
      setShowModal(true);
      setTimeout(() => navigate(`/${lang}`), 2000);
    } catch {
      setModalTitle("Error");
      setModalMessage("Failed to confirm reservation. Please try again later.");
      setShowModal(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="date-picker-container">
          <div className="calendar">
            <div className="calendar-header">
              <button onClick={() => handleChangeMonth(-1)}>Prev</button>
              <span>
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button onClick={() => handleChangeMonth(1)}>Next</button>
            </div>
            <div className="days-of-week">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-days">
              {Array.from(
                {
                  length: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    1
                  ).getDay(),
                },
                (_, i) => (
                  <span key={`empty-${i}`} className="empty-day" />
                )
              )}
              {daysInMonth.map((day) => (
                <span
                  key={day}
                  className={`calendar-day ${
                    isReserved(day) ? "reserved" : ""
                  } ${
                    selectedDate?.getDate() === day &&
                    selectedDate?.getMonth() === date.getMonth()
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleSelectDate(day)}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center text-center my-3">
          <div className="my-3">
            <Form.Select
              aria-label="Select Duration"
              onClick={validateSelectDate}
              value={duration ?? ""}
              onChange={(e)=>{setDuration(e.target.value)}}
            >
              <option>Duration</option>
              {showOptions &&
                availableTime.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
            </Form.Select>
          </div>
          <div className="my-3">
            <Form.Select aria-label="Select Plan" value={selectedPlan} onChange={handleSelectPlan}>
              <option>Plans</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plane_type} {plan.price} JD
                </option>
              ))}
            </Form.Select>
          </div>
          <p>Total Price: {totalPrice} JD</p>
          <button type="submit" className="booknow_button_events mt-3">
            <b>Reserve Now</b>
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </form>
      <ModelAlert
        show={showModal}
        handleClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};

export default ReservationEvents;
