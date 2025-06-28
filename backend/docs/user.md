# USER API SPECS

## Register User API

Endpoint :

- POST /api/users

Request Body :

```json
{
  "username": "rayzor",
  "password": "secret",
  "name": "Ray"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rayzor",
    "name": "Ray"
  }
}
```

Response Body Failed / Error :

```json
{
  "errors": "User already registered"
}
```

## Login User API

Endpoint :

- POST /api/users/login

Request Body :

```json
{
  "username": "rayzor",
  "password": "secret"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Failed / Error :

```json
{
  "errors": "Username or Password wrong"
}
```

## Update User API

Endpoint :

- PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "Edited name", // optional
  "password": "Edited password" //optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "Rayzor",
    "name": "Edited name"
  }
}
```

Response Body Failed / Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint :

- GET /api/users/current

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "username": "Rayzor",
    "name": "Ray"
  }
}
```

Response Body Failed / Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint :

- DELETE /api/users/logout


Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "Success logout"
}
```

Response Body Failed / Error :

```json
{
  "errors": "Unauthorized"
}
```
