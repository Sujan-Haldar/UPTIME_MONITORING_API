
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

### Update user details
To update existing user details send a put request to the following endpoint.
```http
  PUT /api/user
```
Include the following information in your request body(User has to provide phone and atleast one othe information to update):

```json
{
    "phone": "Your_Phone_Number",
    "firstName": "Your_Updated_First_Name",
    "lastName": "Your_Updated_Last_Name",
    "password": "Your_Updated_Password",
}
