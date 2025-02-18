import Course from "./course.jsx";
import './course.css'

const CourseApp = () => {
  const courses = [
    {
      id: 1,
      name: 'Half Stack application development',
      parts: [
        {name: 'Fundamentals of React', exercises: 10, id: 1},
        {name: 'Using props to pass data', exercises: 7, id: 2},
        {name: 'Using state to manage data', exercises: 14, id: 3},
        {name: 'Redux', exercises: 11, id: 4},
        {name: 'React Router', exercises: 13, id: 5},
        {name: 'Testing React applications', exercises: 8, id: 6},
      ]
    },
    {
      id: 2,
      name: 'Node.js',
      parts: [
        {name: 'Routing', exercises: 3, id: 1},
        {name: 'Middleware', exercises: 5, id: 2},
        {name: 'Express', exercises: 15, id: 3},
        {name: 'Mongoose', exercises: 8, id: 4},
        {name: 'MongoDB', exercises: 12, id: 5},
        ]
    }
  ];
  return <Course courses={courses}/>
};

export default CourseApp;