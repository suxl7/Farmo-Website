import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  async getUsers(userType = null) {
    const endpoint = userType ? `${API_ENDPOINTS.USERS}?user_type=${userType}` : API_ENDPOINTS.USERS;
    return await axiosClient.get(endpoint);
  },

  async createUser(userData) {
    const formData = new FormData();
    
    formData.append('user_id', userData.userId);
    formData.append('password', userData.password);
    formData.append('f_name', userData.firstName);
    if (userData.middleName) formData.append('m_name', userData.middleName);
    formData.append('l_name', userData.lastName);
    formData.append('sex', userData.sex);
    formData.append('dob', userData.dateOfBirth);
    formData.append('user_type', userData.userType);
    formData.append('province', userData.province);
    formData.append('district', userData.district);
    formData.append('municipal', userData.municipality);
    formData.append('ward', userData.ward);
    formData.append('tole', userData.tole);
    formData.append('phone', userData.mobileNumber);
    if (userData.secondaryMobileNumber) formData.append('phone2', userData.secondaryMobileNumber);
    formData.append('email', userData.email);
    if (userData.facebook) formData.append('facebook', userData.facebook);
    if (userData.whatsapp) formData.append('whatsapp', userData.whatsapp);
    if (userData.aboutUser) formData.append('about', userData.aboutUser);
    if (userData.profilePicture) formData.append('profile_picture', userData.profilePicture);
    formData.append('created_by', userData.created_by);

    return await axiosClient.post(API_ENDPOINTS.REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data'
      }
    });
  },

  async updateUser(userId, userData) {
    return await axiosClient.put(`${API_ENDPOINTS.USERS}/${userId}/`, userData);
  },

  async deleteUser(userId) {
    return await axiosClient.delete(`${API_ENDPOINTS.USERS}/${userId}/`);
  },

  async checkUserIdAvailability(userId) {
    if (this._checkTimeout) clearTimeout(this._checkTimeout);
    
    return new Promise((resolve, reject) => {
    
      this._checkTimeout = setTimeout(async () => {
        try {
          const result = await axiosClient.post(API_ENDPOINTS.CHECK_USERID, { user_id: userId });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  },

  async getUserProfile(targetUserId) {
    const response = await axiosClient.post(API_ENDPOINTS.USER_PROFILE, {
      target_user_id: targetUserId,
    });

    return {
      userId:         response.user_id,
      fullName:       response.full_name,
      address:        response.address,
      phone:          response.phone,
      phone2:         response.phone2,
      userType:       response.user_type,
      email:          response.email,
      facebook:       response.facebook,
      whatsapp:       response.whatsapp,
      joinDate:       response.join_date,
      about:          response.about,
      dateOfBirth:    response.dob,
      sex:            response.sex,
      profilePicture: response.profile_picture_otp ?? null,
      rating:         response.rating ?? 0.0,
    };
  },

  async updateUserStatus(targetUserId, action) {
    return await axiosClient.post(API_ENDPOINTS.ACTION_STATUS, {
      target_user_id: targetUserId,
      action: action // 'suspend', 'activate', or 'deactivate'
    });
  },

  
  async updateUserProfile(userId, profileData) {
    return await axiosClient.post(API_ENDPOINTS.UPDATE_USER_PROFILE, {
      user_id: userId,
      f_name: profileData.firstName,
      m_name: profileData.middleName,
      l_name: profileData.lastName,
      phone: profileData.phone,
      phone2: profileData.phone2,
      province: profileData.province,
      district: profileData.district,
      municipal: profileData.municipality,
      ward: profileData.ward,
      tole: profileData.tole,
      dob: profileData.dob,
      sex: profileData.sex,
      email: profileData.email,
      facebook: profileData.facebook,
      whatsapp: profileData.whatsapp,
    
  },);
},
  async updateAdminProfile(userId, profileData) {
    return await axiosClient.post(API_ENDPOINTS.UPDATE_ADMIN_PROFILE, {
      user_id: userId,
      phone: profileData.phone,
      phone2: profileData.phone2,
      email: profileData.email,
      facebook: profileData.facebook,
      whatsapp: profileData.whatsapp,
    
  }
    );
  },
};
// import axiosClient from '../utils/axiosClient';
// import { API_ENDPOINTS } from '../config/api';

// export const userService = {
//   async getUsers(userType = null) {
//     const endpoint = userType ? `${API_ENDPOINTS.USERS}?user_type=${userType}` : API_ENDPOINTS.USERS;
//     return await axiosClient.get(endpoint);
//   },

//   async createUser(userData) {
//     const formData = new FormData();
    
//     formData.append('user_id', userData.userId);
//     formData.append('password', userData.password);
//     formData.append('f_name', userData.firstName);
//     if (userData.middleName) formData.append('m_name', userData.middleName);
//     formData.append('l_name', userData.lastName);
//     formData.append('sex', userData.sex);
//     formData.append('dob', userData.dateOfBirth);
//     formData.append('user_type', userData.userType);
//     formData.append('province', userData.province);
//     formData.append('district', userData.district);
//     formData.append('municipal', userData.municipality);
//     formData.append('ward', userData.ward);
//     formData.append('tole', userData.tole);
//     formData.append('phone', userData.mobileNumber);
//     if (userData.secondaryMobileNumber) formData.append('phone2', userData.secondaryMobileNumber);
//     formData.append('email', userData.email);
//     if (userData.facebook) formData.append('facebook', userData.facebook);
//     if (userData.whatsapp) formData.append('whatsapp', userData.whatsapp);
//     if (userData.aboutUser) formData.append('about', userData.aboutUser);
//     if (userData.profilePicture) formData.append('profile_picture', userData.profilePicture);
//     formData.append('created_by', userData.created_by);

//     return await axiosClient.post(API_ENDPOINTS.REGISTER, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },

//   async updateUser(userId, userData) {
//     return await axiosClient.put(`${API_ENDPOINTS.USERS}/${userId}/`, userData);
//   },

//   async deleteUser(userId) {
//     return await axiosClient.delete(`${API_ENDPOINTS.USERS}/${userId}/`);
//   },

//   async checkUserIdAvailability(userId) {
//     // Debounce to prevent rapid calls
//     if (this._checkTimeout) clearTimeout(this._checkTimeout);
    
//     return new Promise((resolve, reject) => {
//       this._checkTimeout = setTimeout(async () => {
//         try {
//           const result = await axiosClient.post(API_ENDPOINTS.CHECK_USERID, { user_id: userId });
//           resolve(result);
//         } catch (error) {
//           reject(error);
//         }
//       }, 300); // Wait 300ms after last keystroke
//     });
//   },

//   async getUserProfile(targetUserId) {
//     return await axiosClient.post(API_ENDPOINTS.USER_PROFILE, { target_user_id: targetUserId });
//   },
// };
