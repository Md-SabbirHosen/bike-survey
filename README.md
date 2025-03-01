# MERN Stack Survey Project

## 📌 Overview
This is a freelancing project: a **Survey Data Collection** project built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). It allows users to submit survey responses, which are stored in a database and can be exported to an **Excel sheet**.

## 🚀 Features
- **User-friendly Survey Form**
- **Real-time Data Storage** (MongoDB Atlas)
- **Excel File Export** for Survey Data
- **API Integration** for Storing & Retrieving Survey Responses
- **Responsive UI** built with React & Tailwind CSS

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Excel Handling:** xlsx package


## 📊 API Endpoints
### **Submit Survey**
**POST** `/api/submit-survey`
#### Request Body (JSON):
```json
{
  "evSurvey":{
    "age": 25,
    "buyEVFuture": "Yes"
  }
  "name": "John Doe",
  "phone": "1234567890",
  "bikeType": "Electric",
  "rankings": [{"feature": "Speed", "rank": 1}],
  "productFeatures": [{"importanceLevel": 5, "satisfactionLevel": 4, "fulfillmentCapacity": 3}]
}
```

### **Get Survey Data**
**GET** `/api/download-excel`
#### Response:
Returns all survey data that is stored in the database in an Excel sheet.


