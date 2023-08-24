# UPTIME_MONITORING_API

The Uptime Monitoring API offers an efficient way to keep track of the online status of user-defined web links. It continuously checks these links to determine if they're active (up) or inactive (down). Users are promptly notified of any state changes, ensuring they're always informed about the accessibility and health of their web resources.

## Key Features

**User-Defined Link Monitoring**:
Users can easily specify which web links they want to monitor, and the API will automatically track their uptime status.

**Instant Notification:**
As soon as the state of a web link changes, be it from up to down or vice versa, the API promptly sends out notifications, enabling users to take immediate action if necessary.

**Periodic Checks:**
The API performs regular and systematic checks on all registered links, ensuring that users are given the most up-to-date status information.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Sujan-Haldar/UPTIME_MONITORING_API
```

Go to the project directory

```bash
  cd UPTIME_MONITORING_API
```

Install dependency

```bash
  npm install nodemon
```

Start the server

```bash
  npm run start
```

## Tech Stack

**Server:** Node.js

## API Reference

### Registering a user

To register a user send a post request to the following endpoint.

```http
  POST /api/user
```

Include the following information in your request body:

```json
{
  "firstName": "Your_First_Name",
  "lastName": "Your_Last_Name",
  "phone": "Your_Phone_Number",
  "password": "Your_Password",
  "tosAgreement": true
}
```

### Get user details

To get existing user details send a get request to the following endpoint.

```http
  GET /api/user?phone="Your_Phone_Number"
```

### Update user details

To update existing user details send a put request to the following endpoint.

```http
  PUT /api/user
```

Include the following information in your request body(User has to provide phone and atleast one other information to update):

```json
{
  "phone": "Your_Phone_Number",
  "firstName": "Your_Updated_First_Name",
  "lastName": "Your_Updated_Last_Name",
  "password": "Your_Updated_Password"
}
```

### Delete user details

To delete existing user send a delete request to the following endpoint.

```http
  DELETE /api/user?phone="Your_Phone_Number"
```

### Generate a token

To generate a token send a post request to the following endpoint.

```http
  POST /api/token
```

Include the following information in your request body:

```json
{
  "phone": "Your_Phone_Number",
  "password": "Your_Password"
}
```

### Get an existing token

To get a token send a get request to the following endpoint.

```http
  GET /api/token?id="YOUR_TOKEN_ID"
```

### Update a token

To update a token send a put request to the following endpoint.

```http
  PUT /api/token
```

Include the following information in your request body:

```json
{
  "id": "YOUR_TOKEN_ID",
  "isExtend": true
}
```

### Delete a token

To delete a token send a delete request to the following endpoint.

```http
  DELETE /api/token?id="YOUR_TOKEN_ID"
```

### Register a check

To register a new link for check send a post request to the following endpoint.

```http
  POST /api/check
```

Include the following information in your request body:

```json
{
  "protocol": "PROTOCOL",
  "url": "YOUR_URL",
  "method": "METHOD",
  "sucessCodes": ["SUCCESS_CODES"],
  "timeoutSeconds": "TIMEOUT_SECONDS"
}
```

Example

```json
{
  "protocol": "http",
  "url": "google.com",
  "method": "get",
  "sucessCodes": [200, 201],
  "timeoutSeconds": 3
}
```

You will get a response that includes an unique check id.

### Get an existing check

To get a check send a get request to the following endpoint.

```http
  GET /api/check?id="YOUR_CHECK_ID"
```

### Update a check

To update a check send a put request to the following endpoint.

```http
  PUT /api/check
```

Include the following information in your request body:

```json
{
  "id": "YOUR_CHECK_ID",
  "protocol": "http",
  "url": "google.com",
  "method": "get",
  "sucessCodes": [200, 201],
  "timeoutSeconds": 3
}
```

### Delete a check

To delete a check send a delete request to the following endpoint.

```http
  DELETE /api/check?id="YOUR_CHECK_ID"
```
