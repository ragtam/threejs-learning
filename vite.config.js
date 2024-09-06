import { defineConfig } from 'vite'

export default defineConfig( ({ command }) => {
    const baseConfig = {};

    if(command === 'build') {
        return {
            ...baseConfig,
            base: '/threejs-learning/'
        }
    }
    return {
        ...baseConfig,
        base: '/'
    };
})