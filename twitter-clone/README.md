# Twitter Clone - Project Overview

This project is a minimal viable Twitter-like website with both frontend and backend API.

## Project Structure

- `frontend/` - Contains all frontend code (HTML, CSS, JavaScript)
- `backend/` - Contains backend API server code

## Frontend

- Built with plain HTML, Tailwind CSS (via CDN), Google Fonts, and Font Awesome for icons
- Responsive design for desktop and mobile
- Pages:
  - Login
  - Signup
  - Home (timeline feed)
  - Profile
  - Tweet posting interface

## Backend

- Node.js with Express framework
- RESTful API endpoints for:
  - User signup and login (with simple JWT or session-based auth)
  - Posting tweets
  - Fetching timeline tweets
  - Following/unfollowing users
- Data storage using in-memory objects or JSON files for MVP

## Development

- Run backend server with `node backend/server.js`
- Open frontend pages in browser (served via simple HTTP server or live server extension)
- Frontend communicates with backend API for dynamic data

## Next Steps

- Implement backend API endpoints
- Build frontend pages and connect to backend
- Add authentication and session management
- Implement tweet posting and timeline display
- Add follow/unfollow functionality
