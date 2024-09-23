import dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const { API_PORT = 3001, VITE_HOST = '' } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [glsl(), nodePolyfills(), react()]
});
