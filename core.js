export default function html([first, ...strings], ...values){
  return values.reduce((acc, cur) => acc.concat(cur, strings.shift()),[first])
  .filter(x => x && x!== true || x===0)
  .join('')
}

export function createStore(reducer){
  let state = reducer()
  const roots = new Map()  // Map is special object because key can any data type

  function render(){
    for(const [root, component] of roots){
      const output = component()
      root.innerHTML = output
    }
  }
  return{
    attach(component, root){
      roots.set(root, component)  // root is an object
      render()
    },
    // Connect func: pull data from store to view 
    connect(selector = state => state){
      return component => (props, ...args) =>
        component(Object.assign({}, props, selector(state), ...args))
    },
    dispatch(action, ...args){
      state = reducer(state, action , args)
      render()
    }
  }
}