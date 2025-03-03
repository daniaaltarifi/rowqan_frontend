import { Container,Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { cities } from "./CityData";
import {
  getRoomOptions,
  getBathroomOptions,
  getFeatures,
  getAdditionalFeatures,
  // getInterfaceOptions,
  getkitchenOptions,
  getswimmingpoolsOptions,
} from "./Data";
import { Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import filter from '../assets/filter.png'
function FilterChalets({
  selectedCity,
  selectedArea,
  filterValues,
  handleCityChange,
  handleAreaChange,
  handleFilterChange,
  availableAreas,
  selectedFeatures,
  setSelectedFeatures,
  selectedAdditionalFeatures,
  setSelectedAdditionalFeatures,
}) {
  const lang = location.pathname.split("/")[1] || "en";
  const roomOptions = getRoomOptions();
  const bathroomOptions = getBathroomOptions();
  const features = getFeatures();
  const additionalFeatures = getAdditionalFeatures();
  // const interfaceOptions = getInterfaceOptions(lang);
  const kitchenOptions = getkitchenOptions();
  const swimmingpoolsOptions = getswimmingpoolsOptions();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleFeatureChange = (id) => {
    setSelectedFeatures((prev) =>
      prev.includes(id)
        ? prev.filter((feature) => feature !== id)
        : [...prev, id]
    );
  };

  const handleAdditionalFeatureChange = (id) => {
    setSelectedAdditionalFeatures((prev) =>
      prev.includes(id)
        ? prev.filter((feature) => feature !== id)
        : [...prev, id]
    );
  };

  FilterChalets.propTypes = {
    selectedCity: PropTypes.string.isRequired,
    selectedArea: PropTypes.string.isRequired,
    filterValues: PropTypes.object.isRequired,
    handleCityChange: PropTypes.func.isRequired,
    handleAreaChange: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    availableAreas: PropTypes.array.isRequired,
    selectedFeatures: PropTypes.array.isRequired,
    setSelectedFeatures: PropTypes.func.isRequired,
    selectedAdditionalFeatures: PropTypes.array.isRequired,
    setSelectedAdditionalFeatures: PropTypes.func.isRequired,
  };
  return (
    <>
      <Container>
        <Col lg={12} md={12} sm={12}>
            <button className="filter_button_chalets " onClick={()=>{setIsFilterOpen(!isFilterOpen)}}>
              {lang === "ar" ? "تصنيف" : "Filter"}
              <img src={filter} alt="filter" className="px-2" />
            </button>
          </Col>
     </Container>
     {isFilterOpen && (
        <div  className={`filter-popup ${isFilterOpen ? "open" : ""}`}>
          <button
            className="close-popup-btn"
            onClick={() => setIsFilterOpen(false)}
          >
            X
          </button>
     <Container>
        <Row className="mb-3">
          <h4 style={{fontWeight:"bold",marginBottom:"20px"}}>{lang === 'ar' ? "تصنيف الشاليهات":"Chalets Filter :"}</h4>
          <Col lg={12} md={6} sm={12}>
            <Form.Select
              aria-label="Select City"
              value={selectedCity ?? ""}
              onChange={handleCityChange}
              className="select_location"
            >
              <option value="">
                {lang === "ar" ? "اختر مدينة" : "Select City"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {lang === "ar" ? city.ar : city.en}
                </option>
              ))}
            </Form.Select>
            {/* Area Dropdown */}
            <Form.Select
              aria-label="Select Area"
              className="select_location mt-3"
              value={selectedArea ?? ""}
              onChange={handleAreaChange}
              disabled={!selectedCity} // Disable area dropdown if no city is selected
            >
              <option value="">
                {lang === "ar" ? "اختر منطقة" : "Select Area"}
              </option>
              {availableAreas.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* ROOMS OPTIONS */}
          <Col lg={12} md={6} sm={12}>
            <Form.Select
            aria-label={lang === "ar" ? "عدد الغرف" : "Number of Rooms"}
            value={filterValues[lang === "ar" ? "عدد الغرف" : "Number of Rooms"] || ""}
            onChange={handleFilterChange(lang === "ar" ? "عدد الغرف" : "Number of Rooms")}
              className="select_location mt-3"
            >
              <option value="">
                {lang === "ar" ? "عدد الغرف" : "Number of Rooms"}
              </option>
              {roomOptions.map((room, index) => (
                <option key={index} value={room}>
                  {room}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* BATHROOMS OPTIONS */}
          <Col lg={12} md={6} sm={12}>
            <Form.Select
              aria-label={lang === "ar" ? "عدد الحمامات" :"Number of BathRooms"}
              value={filterValues[lang === "ar" ? "عدد الحمامات" :"Number of Bathrooms"] || ""} // Display selected value or default to empty
              onChange={handleFilterChange(lang === "ar" ? "عدد الحمامات" : "Number of Bathrooms")}
              className="select_location mt-3"
            >
              <option value="">
                {lang === "ar" ? "عدد الحمامات" : "Number of BathRooms"}
              </option>
              {bathroomOptions.map((bathroom, index) => (
                <option key={index} value={bathroom}>
                  {bathroom}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* FEATURES */}
          <Col lg={12} md={6} sm={12}>
            <Dropdown>
              <Dropdown.Toggle
                id="features-dropdown"
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #cacaca",
                  borderRadius: "10px",
                  marginTop: "12px",
                }}
              >
                {lang === "ar" ? "اختر المزايا" : "Select Features"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {features.map((feature) => (
                  <div key={feature.id} className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <input
                        id={`feature-${feature.id}`}
                        type="checkbox"
                        value={feature.id}
                        checked={
                          Array.isArray(selectedFeatures) &&
                          selectedFeatures.includes(feature.id)
                        } // Ensure `features` is an array
                        onChange={() => handleFeatureChange(feature.id)}
                        className="me-2"
                      />
                      <label htmlFor={`feature-${feature.id}`}>
                        {lang === "ar" ? feature.ar : feature.en}
                      </label>
                    </div>
                  </div>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {/* ADDITIONAL FEATURES */}
          <Col lg={12} md={6} sm={12}>
            <Dropdown>
              <Dropdown.Toggle
                id="features-dropdown"
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #cacaca",
                  borderRadius: "10px",
                  marginTop: "12px",
                }}
              >
                {lang === "ar"
                  ? "  اختر المزاياالاضافية"
                  : "Select Additional Features"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {additionalFeatures.map((additionalFeature) => (
                  <div key={additionalFeature.id} className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <input
                        id={`additional-feature-${additionalFeature.id}`}
                        type="checkbox"
                        value={additionalFeature.id}
                        checked={
                          Array.isArray(selectedAdditionalFeatures) &&
                          selectedAdditionalFeatures.includes(
                            additionalFeature.id
                          )
                        } // Ensure `features` is an array
                        onChange={() =>
                          handleAdditionalFeatureChange(additionalFeature.id)
                        }
                        className="me-2"
                      />
                      <label
                        htmlFor={`additional-feature-${additionalFeature.id}`}
                      >
                        {lang === "ar"
                          ? additionalFeature.ar
                          : additionalFeature.en}
                      </label>
                    </div>
                  </div>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {/* FAMILY OPTIONS */}
          <Col lg={12} md={6} sm={12}>
            {/* <Form.Select
              aria-label={lang === "ar" ? "عدد الزوار" :"Number of Visitors"}
              value={filterValues[lang === "ar" ? "عدد الزوار" : "Number of Visitors"] || ""} // Display selected value or default to empty
              onChange={handleFilterChange(lang === "ar" ? "عدد الزوار" : "Number of Visitors")}
              className="select_location mt-3"
            >
              <option value="">
                {lang === "ar" ? "عدد الزوار" : "Number of Visitors"}
              </option>
              {familyoptions.map((family, index) => (
                <option key={index} value={family}>
                  {family}
                </option>
              ))}
            </Form.Select> */}
            <div>
            <input
              type="number"
              value={filterValues["Number of Visitors"] || ""} // Display selected value or default to empty
              onChange={handleFilterChange("Number of Visitors")}
              id="Number of Visitors"
              className="search_course mt-3"
              placeholder={lang === "ar" ? "عدد الزوار" : "Number of Visitors"}
            />
          </div>
          </Col>
          {/* KITHENS OPTIONS */}
          <Col lg={12} md={6} sm={12}>
            <Form.Select
              aria-label={lang === "ar" ? "عدد المطابخ" :"Number of KITCHENS"}
              value={filterValues[lang === "ar" ? "عدد المطابخ" : "Number of Kitchen"] || ""} // Display selected value or default to empty
              onChange={handleFilterChange(lang === "ar" ? "عدد المطابخ" : "Number of Kitchen")}
              className="select_location mt-3"
            >
              <option value="">
                {lang === "ar" ? "عدد المطابخ" : "Number of Kitchen"}
              </option>
              {kitchenOptions.map((kitchen, index) => (
                <option key={index} value={kitchen}>
                  {kitchen}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* SWIMMING POOLS OPTIONS */}
          <Col lg={12} md={6} sm={12}>
            <Form.Select
              aria-label={lang === "ar" ? "عدد حمامات السباحة" :"Number of swimming pools"}
              value={filterValues[lang === "ar" ? "عدد حمامات السباحة" : "Numberof swimming pools"] || ""} // Display selected value or default to empty
              onChange={handleFilterChange(lang === "ar" ? "عدد حمامات السباحة" : "Numberof swimming pools")}
              className="select_location mt-3"
            >
              <option value="">
                {lang === "ar"
                  ? "عدد حمامات السباحة"
                  : "Number of Swimming pools"}
              </option>
              {swimmingpoolsOptions.map((pools, index) => (
                <option key={index} value={pools}>
                  {pools}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* Building area  */}
          <div>
            <input
              type="number"
              value={filterValues["Building Area"] || ""} // Display selected value or default to empty
              onChange={handleFilterChange("Building Area")}
              id="Building"
              className="search_course mt-3"
              placeholder={lang === "ar" ? "مساحة البناء" : "Building Area"}
            />
          </div>
        </Row>

      </Container>
      </div>
     )}
    </>
  );
}

export default FilterChalets;
