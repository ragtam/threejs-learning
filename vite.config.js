import { defineConfig } from 'vite'

export default defineConfig( ({ command }) => {
    if(command === 'build') {
        return {
            base: '/threejs-learning/'
        }
    }
    return {};
})