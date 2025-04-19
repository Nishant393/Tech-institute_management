import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import server from "../../../cofig/config";

export default function CourseContent() {
  const { courseId } = useParams();
  const [course, setCoursе] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        axios.get(`${server}course/${courseId}`,{withCredentials:true}).then((course)=>{
            console.log("data",course.data.course)
            setCoursе(course.data.course);
        }).catch((e)=>{
            console.log(e)
        })
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return <div className="text-center p-6">Loading course content...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-4xl my-6">
        Error: {error}
      </div>
    );
  }

  if (!course) {
    return <div className="text-center p-6">Course not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Course Details</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-2 font-medium">Category:</td>
                <td>{course.category}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Instructor:</td>
                <td>{course.instructor}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Language:</td>
                <td>{course.language}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Duration:</td>
                <td>{course.duration} month{course.duration > 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Skill Level:</td>
                <td>{course.skill}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Lectures:</td>
                <td>{course.lecture}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Certificate:</td>
                <td>{course.certificate ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Rating:</td>
                <td>{course.avgRating}/5</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Enrolled:</td>
                <td>{course.enrolledStudent} students</td>
              </tr><tr>
                <td className="py-2 font-medium">price:</td>
                <td>{course.price} </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {course.courseUrl?.url && (
          <div className="flex justify-center items-center">
            <img 
              src={course.courseUrl.url} 
              alt={course.title} 
              className="max-h-64 object-contain rounded shadow"
            />
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About This Course</h2>
        <p className="whitespace-pre-wrap">{course.about}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="whitespace-pre-wrap">{course.description}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What You Will Learn</h2>
        <ul className="list-disc pl-5 space-y-2">
          {course.whatYouWillLearn.map((item, index) => (
            <li key={index} className="pl-2">{item}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
        <div className="border rounded-lg overflow-hidden">
          {course.curriculam.map((item, index) => (
            <div key={index} className={`p-4 flex items-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-4">
                {index + 1}
              </div>
              <div>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}