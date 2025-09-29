# 🏡 Airbnb Clone

A full-stack web application inspired by **Airbnb**, where users can register, log in, explore listings, and manage bookings. The project demonstrates authentication, session handling, form validation, and clean UI design using Node.js, Express, and MongoDB.

---

## 🚀 Features

* **User Authentication**

  * Sign up with form validation (name, email, password rules)
  * Login & logout with secure session handling
  * Password confirmation & error messages displayed in red alerts

* **Listings & Booking**

  * Browse property listings (guest view)
  * Host can add/manage their properties
  * Guests can view details and request bookings

* **Error Handling & Validation**

  * Dynamic red popup error messages for invalid inputs
  * Closeable error alert box for user-friendly interaction

* **UI/UX**

  * Clean and responsive design
  * Gradient backgrounds and styled form elements
  * Inline icons for input fields (👤 📧 🔒)

---

## 🛠️ Tech Stack

**Frontend**

* EJS templates
* HTML5, CSS3 (custom + Tailwind classes)
* Responsive UI with form styling

**Backend**

* Node.js
* Express.js
* express-session for session handling
* connect-mongodb-session for session store

**Database**

* MongoDB Atlas (cloud database)

---

## 📂 Project Structure

```
Airbnb-Clone/
│── routes/            # App routes (user, host, auth)
│── views/             # EJS templates (signup, login, home, partials)
│── public/            # Static assets (CSS, images, JS)
│── utils/             # Database connection helpers
│── app.js             # Main server entry
│── package.json       # Dependencies
```

---

## ⚡ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/airbnb-clone.git
   cd airbnb-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root:

   ```env
   MONGO_URI=your-mongodb-connection-string
   SESSION_SECRET=your-secret-key
   PORT=3000
   ```

4. **Run the app**

   ```bash
   npm start
   ```

   Open `http://localhost:3000` in your browser.

---

## ✅ Future Improvements

* Add booking & payment gateway
* Profile management for users/hosts
* Image upload for property listings
* Real-time availability checking

---

## 📸 Screenshots



### Login Page

<img width="1902" height="853" alt="image" src="https://github.com/user-attachments/assets/f0410152-d271-4fb5-a2ae-0981c15256f9" />


---

## 👩‍💻 Author

Developed by **Abdhija Nigam**
🔗 [LinkedIn](https://www.linkedin.com/in/abdhija-nigam/)
