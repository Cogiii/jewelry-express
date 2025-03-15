# JEWELRY EXPRESS

## Description
Jewelry Express is an e-commerce platform specializing in handcrafted jewelry. This platform allows customers to browse products, and book appointments.

## Features
- Product search with live filtering (Google-style search)
- Dynamic product listing with images and names
- Appointment booking with confirmation email
- Secure payment integration
- Role-based authentication (Admin, Customer)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Cogiii/jewelry-express.git
   ```
2. Navigate to the project folder:
   ```bash
   cd jewelry-express
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   node server/server.js
   or
   npm start
   ```

## API Endpoints
### Get Product by ID
```http
GET /api/getProduct/:productId
```
Response:
```json
{
  "id": "123",
  "name": "Amore Earrings",
  "image": "../assets/images/earring.webp",
  "material": "Gold",
  "description": "Handcrafted gold earrings."
}
```

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL, PHPMyAdmin

## Contributors
- **Laurence Kharl Devera** - Front-end Developer, Back-end Developer, Database Designer
- **Jasper Nikko Navarez** - Front-end developer, UI/UX Designer
- **Mc Curvin Royeras** - UI/UX Designer and Front-end Developer

## License
This project is licensed under the MIT License.
