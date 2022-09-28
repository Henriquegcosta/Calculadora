import { useReducer } from "react";
import "./styles.css"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const actions = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){

  switch(type) {
    case actions.ADD_DIGIT: //Quando o usuario clicka em algum numero {1 a 9 e .}

      if (state.overwrite) {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }

      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    
    case actions.CHOOSE_OPERATION: //Quando o usuario escolhe uma  operaçao numerica

      if(state.currentOperand == null && state.previousOperand == null){
        return state
      }

      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation,

        }
      }

      if(state.previousOperand == null){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
      
    case actions.CLEAR: //Aqui é para limpar tudo
      return {}
    
    case actions.DELETE_DIGIT: //Esse aqui deleta digito por digito
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null)return state
      if(state.currentOperand.lenght === 1){
        return{
          ...state,
          currentOperand: null
        }
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case actions.EVALUATE: //Esse aqui é o que faz realmente as contas matematicas
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null){
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }

  
}

function evaluate({currentOperand, previousOperand, operation}){ //Funçao responsavel por fazer todas as contas
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;

    
  }

  return computation.toString()
}

const integer_formatter = new Intl.NumberFormat("pt-br", { 
   maximumFractionDigits: 0,
})

function formatOperand(operand){
  if(operand == null) return
  const[integer, decimal] = operand.split('.')
  if(decimal == null) return integer_formatter.format(integer)
  return `${integer_formatter.format(integer)}.${decimal}`
}

function App() { //Aqui é o coraçao de tudo
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})


  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: actions.CLEAR})}>CLEAR</button>
      <button onClick={() => dispatch({type: actions.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: actions.EVALUATE})}>=</button>
      
    </div>
  );
}

export default App;
