import { useState, useEffect } from "react";
import axios from "axios";
import { userService } from "../../services";
import SessionData from "../../utils/SessionData";

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState(null); // null | true | false
  const currentUserType = SessionData.getUserType()?.toUpperCase();

  // ============================================
  // BACKEND INTEGRATION - Loading & Error States
  // ============================================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    created_by: "Admin",
    userType: "Farmer",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "Male",
    aboutUser: "",
    province: "",
    district: "",
    ward: "",
    tole: "",
    mobileNumber: "",
    secondaryMobileNumber: "",
    email: "",
    whatsapp: "",
    facebook: "",
  });

  const [locationData, setLocationData] = useState(null);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (!formData.userId) {
      setUserIdAvailable(null);
      return;
    }

    const checkUserId = async () => {
      try {
        setCheckingUserId(true);
        const res = await userService.checkUserIdAvailability(formData.userId);
        if (res.status === 0) {
          // user_id is available
          setUserIdAvailable(true);
        } else if (res.status === 1) {
          // user_id is not available
          setUserIdAvailable(false);
        } else {
          // unexpected response
          setUserIdAvailable(null);
        }
      } catch (err) {
        console.error("UserId check error:", err);
        setUserIdAvailable(null);
      } finally {
        setCheckingUserId(false);
      }
    };

    checkUserId();
  }, [formData.userId]);



  // ============================================
  // REPLACED: fetch with axios for loading location data
  // ============================================
  useEffect(() => {
    axios
      .get("/provinces_with_districts_and_municipalities.json")
      .then((response) => setLocationData(response.data))
      .catch((error) => console.error("Failed to load location data:", error));
  }, []);

  useEffect(() => {
    if (locationData && formData.province) {
      const provinceData = locationData[formData.province];
      if (provinceData) {
        setDistricts(Object.keys(provinceData));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.province, locationData]);

  //Handles Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userIdAvailable === false) {
      setError("User ID already exists. Please choose a different one.");
      return;
    }

    setError("");
    setSuccessMessage("");

    setLoading(true);
    try {
      userService.createUser(formData);
      setSuccessMessage(`${formData.userType} registered successfully!`);

      setFormData({
        userId: "",
        password: "",
        created_by: "Admin",
        userType: "Farmer",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        sex: "Male",
        aboutUser: "",
        province: "",
        district: "",
        ward: "",
        tole: "",
        mobileNumber: "",
        secondaryMobileNumber: "",
        email: "",
        whatsapp: "",
        facebook: "",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Register New User
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-6"
        >
          {/* ============================================ */}
          {/* BACKEND INTEGRATION - Error & Success Messages */}
          {/* ============================================ */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Account Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    userIdAvailable === false
                      ? "border-red-500"
                      : userIdAvailable === true
                        ? "border-green-500"
                        : ""
                  }`}
                  required
                />

                {checkingUserId && (
                  <p className="text-sm text-gray-500 mt-1">Checking...</p>
                )}

                {!checkingUserId && userIdAvailable === true && (
                  <p className="text-sm text-green-600 mt-1">✓ Available</p>
                )}

                {!checkingUserId && userIdAvailable === false && (
                  <p className="text-sm text-red-600 mt-1">✗ Already exists</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password<span className="text-red-500">*</span>
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9"
                >
                  <img
                    src={showPassword ? "/show.png" : "/delete.png"}
                    alt="toggle"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              {/* User Type */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Type<span className="text-red-500">*</span>
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {currentUserType === 'SUPERADMIN' && <option value="Admin">Admin</option>}
                  <option value="Farmer">Farmer</option>
                  <option value="Consumer">Consumer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex<span className="text-red-500">*</span>
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About User
              </label>
              <textarea
                name="aboutUser"
                value={formData.aboutUser}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province<span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Province</option>
                  {locationData &&
                    Object.keys(locationData).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District<span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={!formData.province}
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipality<span className="text-red-500">*</span>
                </label>
                <select
                  name="municipality"
                  value={formData.municipality || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={!formData.district}
                >
                  <option value="">Select Municipality</option>
                  {formData.province &&
                    formData.district &&
                    locationData &&
                    Object.entries(
                      locationData[formData.province][formData.district] || {},
                    ).map(([type, municipalities]) =>
                      municipalities.map((municipality) => (
                        <option
                          key={`${type}-${municipality}`}
                          value={municipality}
                        >
                          {municipality}
                        </option>
                      )),
                    )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ward<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tole<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tole"
                  value={formData.tole}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Mobile Number
                </label>
                <input
                  type="tel"
                  name="secondaryMobileNumber"
                  value={formData.secondaryMobileNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || userIdAvailable === false}
              className={`px-6 py-2 rounded-lg transition flex items-center gap-2
             ${
               !loading && userIdAvailable !== false
                 ? "bg-green-600 text-white hover:bg-green-700"
                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
             }`}
            >
              {/* ============================================ */}
              {/* BACKEND INTEGRATION - Loading Spinner */}
              {/* ============================================ */}
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                "Register User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
