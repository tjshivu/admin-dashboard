# Backend Requirements for Admin Dashboard

The Admin Dashboard is now a standalone Next.js application running on a separate origin (typically `http://localhost:3000` or a deployed domain).

To ensure the dashboard can communicate with the backend, you must enable **CORS (Cross-Origin Resource Sharing)** on the backend.

## Required Origins

The backend must allow requests from the following origins:

- `http://localhost:3000` (Local Development)
- `https://ops.yourdomain.com` (Production - Replace with actual domain)

## Example (Express.js)

If using `cors` middleware in Express:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://ops.yourdomain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Important for cookies/sessions if used
}));
```

## Security Note

Ensure strict CORS policies are in place for production environments to prevent unauthorized access from other domains.
