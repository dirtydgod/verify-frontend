# Canto Discord NFT Verification Bot Frontend

This repository contains the frontend of Frenly Faces Developer's NFT Verification Bot for Canto. You will also need to run the [backend API](https://github.com/frenlyfaces/verify-backend) in order for this to function.

## deploying this frontend

it is recommended to fork this repository and deploy with [vercel](https://vercel.com). this will allow you to easily add a custom domain or use a subdomain.

the following environment variables are required to be set on vercel before deploying:

```
REACT_APP_DISCORD_REDIRECT_URI={your custom domain here with https:// prefix}
REACT_APP_BLOCK_EXPLORER_URI={block explorer link e.g. https://tuber.build}
REACT_APP_PROJECT_NAME={Your Project Name Here}
REACT_APP_VERIFY_API={your verify backend URI here}
```

## development setup

clone the repository

```
git clone git@github.com:frenlyfaces/verify-frontend
```

install the dependencies

```
npm i
```

create the required .env file

```
REACT_APP_DISCORD_REDIRECT_URI=http://localhost:3000/verify
REACT_APP_BLOCK_EXPLORER_URI=https://tuber.build
REACT_APP_PROJECT_NAME={Your Project Name Here}
REACT_APP_VERIFY_API={your verify backend URI here}
```

