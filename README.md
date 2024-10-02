# Smash Siege game

An Angry-bird like game made in React-three-fiber. Now also includes a public library with a level editor.

![image](https://github.com/user-attachments/assets/922ca94f-bf7f-495d-a605-aeb2ea741e52)

Demo: https://clownfish-app-asv3f.ondigitalocean.app/

## Dev

- run `yarn` on pull.

- Add `.env` and set the necessary ENVs:

  - VITE_MONA_APP_ID
  - VITE_PHYSICS_DEBUG (optional)
  - DATABASE_URL (your postgres:// connection string)

- run `yarn dev` to launch locally

## GLTF

When adding new GLTF items, run `npx gltfjsx [file path] -t` and move the generated `.tsx` file to where you want it; Don't forget to rename the component and fix the types!

## Production

Build command `yarn build` or `yarn install --production=false && yarn build` depending on your environment;  
Run command: `yarn start`
