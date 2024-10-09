import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import viteCompression from 'vite-plugin-compression';
// import visualizer from 'rollup-plugin-visualizer';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    viteCompression({ algorithm: 'gzip' }),
    // visualizer({ open: true }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // @ts-ignore
          if (id.includes('node_modules')) {
            // @ts-ignore
            if (id.includes('@faker-js')) {
              return 'vendor-faker';
            }
            return 'vendor'; // 他の依存関係を共通チャンクとして分割
          }
        }
      }
    }
  }
})
