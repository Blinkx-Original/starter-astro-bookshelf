import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: 'static',           // build estático
  integrations: [tailwind()]  // tailwind sigue igual
});
