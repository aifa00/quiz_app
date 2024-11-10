"use client";

import React, { useEffect, useState } from "react";
import { useQuiz } from "@/app/store";

type categoryType = {
  id: number;
  name: string;
};

export default function Instructor() {
  const quizConfig = useQuiz((state: any) => state.config);
  const addCategory = useQuiz((state: any) => state.addCategory);
  const addLevel = useQuiz((state: any) => state.addLevel);
  const addType = useQuiz((state: any) => state.addType);
  const addNumberOfQuestions = useQuiz(
    (state: any) => state.addNumberOfQuestions
  );
  const addStatus = useQuiz((state: any) => state.addStatus);
  const [category, setCategory] = useState<categoryType[]>([]);
  const type = ["boolean", "multiple"];
  const level = ["easy", "medium", "hard"];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const data = await res.json();
        setCategory([...data.trivia_categories]);

        // set default options
        addNumberOfQuestions(10);
        addLevel(level[0]);
        addType(type[0]);
        addCategory(
          data?.trivia_categories[0]?.id,
          data?.trivia_categories[0]?.name
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);

  const handleOnclick = () => {
    if (
      !quizConfig.numberOfQuestions ||
      !quizConfig.category.name ||
      !quizConfig.level ||
      !quizConfig.type
    )
      return alert("Please select all the fields");
    if (quizConfig.numberOfQuestions <= 0 || quizConfig.numberOfQuestions > 50)
      return alert('Select "Number of questions" between 1 and 50');
    addStatus("start");
  };

  return (
    <div className="relative min-h-screen py-8 bg-[url('https://img.freepik.com/free-vector/gradient-abstract-background_23-2149131346.jpg')] bg-center bg-cover">
      <div className="w-3/4 lg:w-1/4 text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-5xl font-bold text-white mt-10 mb-3">
          Welcome To Quizify
        </h1>

        <div className="flex flex-col space-y-2 mb-2">
          <p className="text-md text-white mt-2">
            Number of questions (1 - 50 ):
          </p>
          <input
            className="px-3 py-4 border border-gray-500 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={quizConfig.numberOfQuestions}
            min={1}
            max={50}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (num < 0 || num > 50) return;
              addNumberOfQuestions(e.target.value);
            }}
          />

          <div className="flex flex-col">
            <p className="text-md text-white mt-2">Select Difficulty:</p>

            <select
              onChange={(e) => addLevel(e.target.value)}
              className="px-3 py-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {level.map((level) => (
                <option className="text-center" key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <p className="text-md text-white mt-2">Select Category:</p>

            <select
              onChange={(e) => {
                const selectedCategory = JSON.parse(e.target.value);
                addCategory(selectedCategory.id, selectedCategory.name);
              }}
              className="px-3 py-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {category.map((category) => (
                <option
                  className="text-center"
                  key={category.id}
                  value={JSON.stringify(category)}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <p className="text-md text-white mt-2">Select Type:</p>

            <select
              onChange={(e) => addType(e.target.value)}
              className="px-3 py-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {type.map((type) => (
                <option className="text-center" key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {quizConfig?.category?.name && (
          <button
            onClick={handleOnclick}
            className="mt-8 py-2 px-4 bg-pink-500 text-white font-bold rounded-md hover:bg-purple-700"
          >
            Start quiz now
          </button>
        )}
      </div>
    </div>
  );
}
