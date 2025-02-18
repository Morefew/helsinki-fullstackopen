const Header = ({title}) => {
  return <h1 className="course-header">{title}</h1>;
};

const Content = ({parts}) => {
  return (
    <div className="course-content">
      {parts.map((part, index) => (
        <div className="part" key={index}> <p className='part-name'>{part.name}</p> <p className='part-exercises'>{part.exercises}</p> </div>
      ))}
    </div>
  );
};

const Total = ({parts}) => {
  return <strong className="total">Total number of
    exercises: {parts.reduce((acc, part) => acc + part.exercises, 0)}</strong>
};

const Course = ({courses}) => {

  return (
    <div className="main-container">
      <h1>Courses</h1>
      {courses.map((course) => (
        <div className="course" key={course.id}>
          <Header title={course.name}/>
          <Content parts={course.parts}/>
          <Total parts={course.parts}/>
        </div>
      ))}
    </div>
  );
};

export default Course;