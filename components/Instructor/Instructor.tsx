'use client';

import React, { useEffect, useState } from "react";
import { useQuiz } from "@/app/store";

type categoryType = {
  id: number,
  name: string
}



export default function Instructor() {
  
  const quizConfig = useQuiz((state:any) => state.config );
  const addCategory = useQuiz((state:any) => state.addCategory);
  const addLevel = useQuiz((state:any) => state.addLevel);
  const addType = useQuiz((state:any) => state.addType);
  const addNumberOfQuestions = useQuiz((state:any) => state.addNumberOfQuestions);
  const addStatus = useQuiz((state:any) => state.addStatus);
  const [loading, setLoading] = useState<boolean>(false);

  const [category, setCategory] = useState<categoryType[]>([]);

  useEffect(() => {
    const fetchCategory = async() => {      
      try {
        setLoading(true)
        const res = await fetch('https://opentdb.com/api_category.php');
        const data = await res.json();      
        setCategory([...data.trivia_categories]);
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false);
      }          
    }
    fetchCategory()
  }, []);

  const type = ['boolean', 'multiple'];
  const level = ['easy', 'medium', 'hard'];


  const handleOnclick = (e:React.MouseEvent<HTMLButtonElement>) => {    
    if (!quizConfig.numberOfQuestions || !quizConfig.category.name || !quizConfig.level || !quizConfig.type) return alert('Please select all the fields');
    if (quizConfig.numberOfQuestions <= 0 || quizConfig.numberOfQuestions > 50) return alert('Select "Number of questions" between 1 and 50')
    addStatus('start');
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-8 bg-[url('https://img.freepik.com/free-vector/gradient-abstract-background_23-2149131346.jpg')] bg-center bg-cover absolute inset-0 bg-black opacity-150 transition-opacity duration-500 ease-in-out"> 
    <h1 className="text-5xl font-bold text-white mt-10 mb-3">Welcome To Quiz App</h1>
    <div className="flex flex-col space-y-2 mb-2">
      <p className="text-md text-white mt-2">&nbsp; NUMBER OF QUESTIONS &nbsp;</p>
      <input
        className="px-3 py-4 border border-gray-500 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        defaultValue={10}        
        min={1}
        max={50}
        onChange={(e) => addNumberOfQuestions(e.target.value)}
      />
    </div>
    <div className="flex flex-row space-x-4 mt-4">
      
      {!loading ? (
        <>
        <div className="flex flex-col">
          <select onChange={(e) => addLevel(e.target.value)} className="px-3 py-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option className="text-center" value="">SELECT DIFFICULTY &nbsp; 👇</option>
            {
              level.map((level) => 
                <option key={level} value={level}>{level}</option>
              )
            }
          </select>
        </div>

        <div className="flex flex-col">
          <select onChange={(e) => {
            const selectedCategory = JSON.parse(e.target.value);
            addCategory(selectedCategory.id, selectedCategory.name);
          }}
          className="px-3 py-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option className="text-center" value="">SELECT CATEGORY &nbsp; 👇</option>
            {            
              category.map((category) => 
                <option key={category.id} value={JSON.stringify(category)}>{category.name}</option>
              )
            }             
          </select>
        </div>
        <div className="flex flex-col">
          <select onChange={(e) => addType(e.target.value)} className="px-3 py-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option className="text-center" value="">&nbsp;SELECT TYPE &nbsp; 👇</option>
            {
              type.map((type) => 
                <option key={type} value={type}>{type}</option>
              )
            }
          </select>
        </div>
        </>
      ) : <h1 className="text-white">Loading...</h1> }
            
    </div>

    <button onClick={handleOnclick} className="mt-8 py-2 px-4 bg-pink-500 text-white font-bold rounded-md hover:bg-purple-700">
      Start quiz now
    </button>
  </div>
  );
}

