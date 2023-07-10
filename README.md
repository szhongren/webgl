# This is a React project for writing and trying out webgl stuff

Bootstrapped with Create React App with typescript

## How to do this yourself

`npx create-react-app webgl --template typescript`

We need to customize webpack in order to handle the shader files

`npm run eject`

Make sure webpack version is 5+.

In `webpack.config.js`, go to `module.rules` (or find the string `oneOf`) to modify the list of loaders.

Add the following loader to the front of the list:

```
{
    test: /\.(glsl|vert|frag)$/,
    type: "asset/source",
},
```

Create a shaders directory and put your shaders there, in `/src`.

Create a types directory and add the following definitions, in `/src`:

```
declare module "*.frag" {
  const value: string;
  export default value;
}

declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}
```

In `tsconfig.json`, add the following to your `typeRoots` for Typescript to be able to find your custom types:

```
"typeRoots": [
    "./node_modules/@types",
    "./src/@types"
],
```

Now, you will be able to import your shaders with `import vertShader from './relative/path/to/shader/from/App/vertShader.vert` in `App.tsx`.

Happy WebGling!
