"use client";

import { useQuiz } from "@/app/store";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";

type objType = {
  answers: string[];
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

function QuizComponent() {
  const [questions, setQuestions] = useState<any>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [qstnNo, setQstnNo] = useState<number>(1);

  const config = useQuiz((state: any) => state.config);
  const addScore = useQuiz((state: any) => state.addScore);
  const reset = useQuiz((state: any) => state.reset);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://opentdb.com/api.php?amount=${config.numberOfQuestions}&category=${config.category.id}&difficulty=${config.level}&type=${config.type}`
        );
        const data = await res.json();

        const modifiedResult = data.results.map((obj: objType) => {
          let answers = [obj.correct_answer, ...obj.incorrect_answers]
            .map((ans) => ({ ans, randomNum: Math.random() }))
            .sort((a, b) => a.randomNum - b.randomNum)
            .map((obj) => obj.ans);

          return { ...obj, answers };
        });

        setQuestions(modifiedResult);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, [config.numberOfQuestions, config.category.id, config.level, config.type]);

  const handleNext = () => {
    if (!answer) return alert(`Please complete question ${qstnNo}`);
    let remainingQstns = [...questions];
    remainingQstns.shift();
    setQstnNo(qstnNo + 1);
    setQuestions(remainingQstns);
    setAnswer("");
  };

  const checkAnswer = (ans: any) => {
    if (answer) return;
    if (ans === questions[0].correct_answer) {
      addScore();
    }
    setAnswer(questions[0].correct_answer);
  };

  return (
    <>
      <button
        className="absolute top-3 left-3 bg-gray-200 hover:bg-gray-100 rounded-full p-3"
        onClick={() => reset()}
      >
        <BsArrowLeft />
      </button>
      <div className="flex flex-col justify-center items-center h-screen bg-indigo-300">
        <div className="text-2xl font-bold mb-4">
          Questions &nbsp;{" "}
          {qstnNo <= config.numberOfQuestions
            ? qstnNo
            : config.numberOfQuestions}
          /{config.numberOfQuestions}
        </div>
        <div
          className={
            qstnNo <= config.numberOfQuestions
              ? "text-lg mb-8"
              : "text-4xl md:text-6xl lg:text-8xl mb-8 font-bold"
          }
        >
          Score: {config.score} / {config.numberOfQuestions}
        </div>

        {questions.length ? (
          <div
            className="text-xl lg:text-2xl font-bold max-w-4xl mb-8 text-center"
            dangerouslySetInnerHTML={{ __html: questions[0]?.question }}
          ></div>
        ) : null}

        <div className="flex flex-col w-5/6 space-y-4 mb-10 lg:w-[30%]">
          {questions.length > 0 && !loading
            ? questions[0].answers.map((ans: any) => {
                return (
                  <button
                    key={ans}
                    onClick={() => checkAnswer(ans)}
                    className={`text-black font-bold p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                      answer
                        ? answer === ans
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {ans}
                  </button>
                );
              })
            : loading && <h1 className="text-center">Loading...</h1>}
        </div>
        {qstnNo <= config.numberOfQuestions ? (
          <button
            onClick={handleNext}
            className="bg-pink-500 hover:bg-purple-700 text-white font-bold py-2 w-3/4 lg:w-[15%] rounded-md focus:outline-none"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => reset()}
            className="bg-pink-500 hover:bg-purple-700 text-white font-bold py-2 w-3/4 md:w-[20%] rounded-md focus:outline-none"
          >
            ⬅ &nbsp; Go Back
          </button>
        )}
      </div>
    </>
  );
}

export default QuizComponent;
