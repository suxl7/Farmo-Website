import { useState, useEffect } from 'react';

const AddUser = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    isAdmin: 'No',
    userType: 'Farmer',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    sex: 'Male',
    profilePicture: null,
    aboutUser: '',
    province: '',
    district: '',
    ward: '',
    tole: '',
    mobileNumber: '',
    secondaryMobileNumber: '',
    email: '',
    whatsapp: '',
    facebook: ''
  });

  const [locationData, setLocationData] = useState(null);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch('/provinces_with_districts_and_municipalities.json')
      .then(res => res.json())
      .then(data => setLocationData(data));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newUser = {
      ...formData,
      id: `${formData.userType[0]}${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert(`${formData.userType} registered successfully!`);
    
    // Reset form
    setFormData({
      userId: '', password: '', isAdmin: 'Yes', userType: 'Farmer',
      firstName: '', middleName: '', lastName: '', dateOfBirth: '', sex: 'Male',
      profilePicture: null, aboutUser: '', province: '', district: '', ward: '',
      tole: '', mobileNumber: '', secondaryMobileNumber: '', email: '',
      whatsapp: '', facebook: ''
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Register New User</h2>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          
          {/* Account Information */}
                <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  </div>
                
                  
                
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Type<span className="text-red-500">*</span></label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Consumer">Consumer</option>
                    {formData.isAdmin === 'Yes' && <option value="Admin">Admin</option>}
                  </select>
                  </div>
                </div>
                </div>

                {/* Personal Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name<span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth<span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex<span className="text-red-500">*</span></label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">About User</label>
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
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province<span className="text-red-500">*</span></label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Province</option>
                    {locationData && Object.keys(locationData).map(province => (
                    <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District<span className="text-red-500">*</span></label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={!formData.province}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Municipality<span className="text-red-500">*</span></label>
                    <select
                      name="municipality"
                      value={formData.municipality || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      disabled={!formData.district}
                    >
                      <option value="">Select Municipality</option>
                      {formData.province && formData.district && locationData && 
                        Object.entries(locationData[formData.province][formData.district] || {}).map(([type, municipalities]) => 
                          municipalities.map(municipality => (
                            <option key={`${type}-${municipality}`} value={municipality}>{municipality}</option>
                          ))
                        )
                      }
                    </select>
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward<span className="text-red-500">*</span></label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tole<span className="text-red-500">*</span></label>
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
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number<span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Mobile Number</label>
                <input
                  type="tel"
                  name="secondaryMobileNumber"
                  value={formData.secondaryMobileNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
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
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
