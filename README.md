# deta-users-microservices
users authenticatin microservice api for deploy at deta.sh

##### Usage :
clone this repo and deploy at [deta.sh](https://www.deta.sh/) or demo at https://blisshub.deta.dev

## API

Create User : https://blisshub.deta.dev/api/v1/user/create
```
POST https://blisshub.deta.dev/api/v1/user/create
Content-Type: application/json

{
    "email": ${email},
    "username": ${user},
    "password": ${password}
}

```

Create User : https://blisshub.deta.dev/api/v1/user/login
```
POST https://blisshub.deta.dev/api/v1/user/login
Content-Type: application/json

{
    "username": ${user},
    "password": ${password}
}

```
Verify Session : https://blisshub.deta.dev/api/v1/user/verify
```
POST https://blisshub.deta.dev/api/v1/user/verify
Content-Type: application/json

{
    "tokenId": ${sessionId}
}
```

Logout : https://blisshub.deta.dev/api/v1/user/logout
```
POST https://blisshub.deta.dev/api/v1/user/logout
Content-Type: application/json

{
    "tokenId": ${sessionId}
}
```
