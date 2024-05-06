# Image Upload

Created by Jibon Krishna.

## Features:

- Drag or drop image files.
- Dirict host to ImgBB server.
- Store image array to MongoDB.
- Get the array of image links.
- View the images.

## Edit Environment Variables

### Frontend

Clone the repository and go to `cd react-image-link-generator-frontend` then create a environment variable called `.env.local`. Also you can see an "example.env" file. You can delete it. In `.env.local` add your own:
`VITE_IMAGE_HOST_API_KEY=Your ImgBB api host key`
`VITE_SERVER_URL=Your server URL`

### Backend

After cloning the repository go to `cd react-image-link-generator-frontend` then create a environment variable called `.env`. Also you can see an "example.env" file. You can delete it. In `.env` file add your own:
`DB_USER=Your own MongoDB user name`
`DB_PASS= Your own MongoDB user password`

## Run Command

### Frontend

After adding environment variable Go to `cd react-image-link-generator-frontend` and run the command `npm run dev` to run in development mode.

### Frontend

After adding environment variable Go to `cd react-image-link-generator-backend` and run the command `npm start` to run in development mode.
