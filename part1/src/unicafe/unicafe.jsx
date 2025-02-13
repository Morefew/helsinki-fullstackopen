import {useState} from 'react'

// const Statistics = ({good, neutral, bad}) => {
const Statistics = ({feedback}) => {
  const {good, neutral, bad} = feedback
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : ((good * 1) + (neutral * 0) + (bad * -1)) / total;
  const percentageGood = total === 0 ? 0 : (good / total) * 100;

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Good:</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>Neutral:</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>Bad:</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>Total:</td>
          <td>{total}</td>
        </tr>
        <tr>
          <td>Average:</td>
          <td>{average.toFixed(5)}</td>
        </tr>
        <tr>
          <td>Percentage good:</td>
          <td>{percentageGood.toFixed(2)}%</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

const Button = ({onClick, text}) => {
  return (<button onClick={onClick}>{text}</button>)
}

const UniCafe = () => {

  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    bad: 0
  })

  const increaseGood = () => {
    const updatedFeedback = {...feedback, good: feedback.good + 1}
    setFeedback(updatedFeedback)
  }

  const increaseNeutral = () => {
    const updatedFeedback = {...feedback, neutral: feedback.neutral + 1}
    setFeedback(updatedFeedback)
  }

  const increaseBad = () => {
    const updatedFeedback = {...feedback, bad: feedback.bad + 1}
    setFeedback(updatedFeedback)
  }

  return (
    <div>
      <h1>UniCafe</h1>
      <h2>How was your experience?</h2>
      <Button onClick={increaseGood} text="Good"/>
      <Button onClick={increaseNeutral} text="Neutral"/>
      <Button onClick={increaseBad} text="Bad"/>
      <Statistics feedback={feedback}/>
    </div>
  )
};

export default UniCafe;