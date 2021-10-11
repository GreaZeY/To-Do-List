import React, { useState } from "react"
document.title = "ToDo List"

let happened = false;
let localState = []
document.addEventListener('keydown', (event) => {
  if ( event.key === 'Enter') {
    document.getElementById("plus").click();
  }
}, false)




function App() {
  const [inputList, setInputList] = useState('');
  const [items, setItems] = useState([])
  const [done, setDone] = useState('')


  if (!happened) { // caching data from Local Storage
    localState = JSON.parse(localStorage.getItem('workList'))
    if (localState) {
      if (localState.length !== '0') {
        setItems(localState);
      }
      localState = []
    }
    happened = true;
  }

  const mode = () => {
    document.body.classList.toggle('dark')
    if (localStorage.getItem('theme') === 'light') {
      localStorage.setItem('theme', 'dark')
      setDone('dark')
    }
    else {
      localStorage.setItem('theme', 'light')
      setDone('light')
    }
    

  }
  const itemEvent = (event) => {
    setInputList(event.target.value)
  }

  const handlePlus = () => {
    if (inputList?.length === 0 | !inputList) return;
    setItems((old) => {
      let todo = {work:inputList,
                  status:"pending"}
      return [...old, todo]
    })
    localState = [...items]
    localState.push({work:inputList,
                      status:"pending"})
    localStorage.setItem('workList', JSON.stringify(localState))
    localState = []
    setInputList('')

  }

  const cross = async (idx) => {
    let localState = []
    await setItems(old => {
      return old.filter((v, i) => {
        if (i !== idx) {
          localState.push(v)
        }
        return i !== idx
      })

    })
    
    localStorage.setItem('workList', JSON.stringify(localState))
    localState = []
  }

  const tick = async(idx) => {
    await setDone(items.map((todo,i)=>{ 
      if(i===idx) return todo.status = 'done'; 
      return tick
    }))
    localStorage.setItem('workList', JSON.stringify(items))
  }

  return (
    <React.Fragment>
      <label className="switch" datatooltip={'Switch to '+(localStorage.getItem('theme') === 'light'?'dark mode':'light mode')}>
        <input id="ipchkbox" type="checkbox"  onChange={mode}></input>
        <span className="slider round" ></span>
      </label>
      
      <div id="maindiv" className="mainDiv">
        <h1 >ToDo-List</h1>
        <br></br>
        <div className="todo">
          <input className="ipt" type="text" placeholder="So, What are you going to do?" value={inputList} onChange={itemEvent}>
          </input>
          <button id="plus" className="butt plus" onClick={handlePlus} datatooltip="Add to List">+</button>
        </div>
        
        <hr></hr>
        {items.map((item, idx) => <div key={idx}><p className={item.status==='done'?"list cut":"list" } id={"work" + idx}>{item.work}</p>
          <button id={'tick' + idx} className="butt tick" datatooltip="Mark Done" onClick={() => tick(idx)}>✓</button>
          <button id={idx} className="cross butt" datatooltip="Delete" onClick={() => cross(idx)}>×</button></div>)}

      </div>
    </React.Fragment>
  );

}

export default App;
