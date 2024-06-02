'use client'

import { useQuiz } from "@/app/store";
import { useEffect, useState } from "react";

type objType = {
    answers: string[]
    category: string
    correct_answer: string
    difficulty:string
    incorrect_answers: string[]
    question: string
    type:string
}

function QuizComponent() {

    const [questions, setQuestions] = useState<any>([]);
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [qstnNo, setQstnNo] = useState<number>(1);

    const config = useQuiz(((state:any) => state.config));
    const addScore = useQuiz((state:any) => state.addScore);
    const reset = useQuiz((state:any) => state.reset);
    
    useEffect (() => {
        const fetchQuestions = async() => {
            try {
                setLoading(true);      
                const res = await fetch(`https://opentdb.com/api.php?amount=${config.numberOfQuestions}&category=${config.category.id}&difficulty=${config.level}&type=${config.type}`)
                const data = await res.json();                
                
                const modifiedResult = data.results.map ((obj:objType) => {

                    let answers = [obj.correct_answer, ...obj.incorrect_answers]//[ans1, ans2, ans3, ans4]
                    .map((ans) => ({ans, randomNum: Math.random()}))//[{ans: ans1, randomNum: 0.2222}, {ans: ans2, randomNum: 0.8822}, {ans: ans3, randomNum: 0.1702}, {ans: ans1, randomNum: 0.2222}]
                    .sort((a, b) => a.randomNum - b.randomNum)//[{ans: ans3, randomNum: 0.1702}, {ans: ans1, randomNum: 0.2222}, {ans: ans4, randomNum: 0.2322}, {ans: ans2, randomNum: 0.8822}]
                    .map ((obj) => obj.ans)//[ans3, ans1, ans4, ans2]

                    // obj.answers = answers;
                    return {...obj, answers};
                })

                setQuestions(modifiedResult);
                setLoading(false);
                console.log('MODIFIED RESULT', modifiedResult); 
                
            } catch (error) {
                console.log(error);                
            }
        }
        fetchQuestions();
    }, [config.numberOfQuestions, config.category.id, config.level, config.type]) 
    
    

    const handleNext = () => {
        if (!answer) return alert (`Please complete question ${qstnNo}`);
        let remainingQstns = [...questions];
        remainingQstns.shift();
        setQstnNo(qstnNo + 1);
        setQuestions(remainingQstns);
        setAnswer('');
    }


    const checkAnswer = (ans:any) => {
        if (answer) return;
        if (ans === questions[0].correct_answer) {
            addScore();    
        }
        setAnswer(questions[0].correct_answer);
    }

  return (
    <>
    <span className="p-6 text-4xl cursor-pointer" onClick={() => reset()}>🔙</span>
    <div className="flex flex-col justify-center items-center h-screen">        
    <div className="text-2xl font-bold mb-4">Questions &nbsp; {qstnNo <= config.numberOfQuestions? qstnNo : config.numberOfQuestions}/{config.numberOfQuestions}</div>   
    <div className={qstnNo <= config.numberOfQuestions ? "text-lg mb-8" : "text-8xl mb-8 font-bold"}>Score: {config.score} / {config.numberOfQuestions}</div>

    <div className="text-2xl font-bold max-w-4xl mb-8 text-center"> {questions.length ? questions[0].question : null}</div>

    <div className="flex flex-col space-y-4 mb-10 w-[30%]">

        {
            questions.length && !loading ? 

            questions[0].answers.map ((ans:any) => {
    
                return <button key={ans} onClick={()=> checkAnswer(ans)} 
                style={{backgroundColor: `${answer ? (answer && answer === ans ? '#28a928' : 'rgb(235 33 33)') : '#b9b9b9'}`}}//color: red green gray
                className={` text-black font-bold p-2 rounded-md focus:outline-none`}>{ans}
                </button>

            })

            : <h1 className="text-center">Loading...</h1>
        } 

    </div>
    {qstnNo <= config.numberOfQuestions ?
    <button onClick={handleNext} className="bg-pink-500 hover:bg-purple-700 text-white font-bold py-2 w-[15%] rounded-md focus:outline-none">Next</button>:
    <button onClick={() => reset()} className="bg-pink-500 hover:bg-purple-700 text-white font-bold py-2 w-[20%] rounded-md focus:outline-none"> ⬅ &nbsp; Go Back</button>
    }
    </div>    
    </>
  )
}

export default QuizComponent;