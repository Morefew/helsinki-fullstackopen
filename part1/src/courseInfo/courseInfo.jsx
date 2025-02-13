
const Header = ({ title }) => {
  return <h1>{title}</h1>;
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part, index) => (
        <p key={index} > Course {index + 1} - {part.name}. Exercises:{part.exercises} </p>
      ))}
    </div>
  );
};

const Total = ({ parts }) => {
  return <p>Total number of exercises: {parts.reduce((acc, part) => acc + part.exercises, 0)}</p>
};

const CourseInfo = () => {
const course = {
  name: 'Half Stack applicacation development',
  parts: [
    {name: 'Fundamentals of React', exercises: 10},
    {name: 'Using props to pass data', exercises: 7},
    {name: 'Using state to manage data', exercises: 14}
  ]
}
  return (
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default CourseInfo;