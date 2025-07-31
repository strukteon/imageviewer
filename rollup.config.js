import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';

export default {
    input: ['src/imageviewer.js'],
    output: [
        {
            dir: 'dist',
            format: 'es',
            sourcemap: true,
            entryFileNames: '[name].bundle.js' // Output file names based on input file names
        }
    ],
    plugins: [
        nodeResolve(),
        commonjs({
            include: /node_modules/,
            requireReturnsDefault: 'auto', // <---- this solves default issue
        }),
        terser({
            compress: {
                toplevel: false, // don’t drop top-level unused
            },
            mangle: {
                toplevel: false,
                //reserved: ['imageviewer'], // don’t mangle this name
                properties: {
                    regex: /^__/  // only mangle properties starting with __
                }
            },
        })
    ]
};
