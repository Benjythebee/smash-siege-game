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



## Some TODOS
Some todos I can think of right now, more will probably be added in the future

**Slingshot mechanics**
- [ ] Find out what Mona provides in terms of 3d asset (extensions like glb, fbx etc...)

**Levels:**
- [ ] Add ability to search custom levels
- [ ] Add image for each "default" level

**Level Editor:**
- [x] Ability to upload level and play it
- [ ] Should be able to test the level before uploading it.
- [ ] Improve Design and CSS
- [x] Allow loading previously uploaded levels to edit them
- [x] add gizmos to platforms
- [ ] add gizmos to environment objects
- [ ] (MAYBE) Add ability to have custom GLBs as element in the level ?

**Server:**
- [ ] API to allow editing levels
- [ ] API to remove levels ?
- [ ] Scores per custom levels ?
