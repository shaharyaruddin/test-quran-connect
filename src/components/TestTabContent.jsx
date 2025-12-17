import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTest } from "@/reducers/apiSlice";
import QuizProgress from "./QuizProgress";
import { ChevronLeft, Check, X } from "lucide-react";
import TestModalWithoutUser from "./TestModalWithoutUser";
import { useTranslation } from "react-i18next";
import Button2 from "./Button2";
import Modal from "./Modal";
import { createPortal } from "react-dom";

const TestTabContent = ({ quiz, id, detail }) => {
  const { t } = useTranslation("common");
  const [currentQues, setCurrentQues] = useState(0);
  const [answer, setAnswer] = useState([]);
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.api.user);

  const totalQuestions = quiz?.length - 1;
  const progressPercentage = (currentQues / totalQuestions) * 100;

  const handlePrevQues = () => setCurrentQues(currentQues - 1);
  const handleNextQues = () => setCurrentQues(currentQues + 1);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handlePreview = () => {
    setPreview(true);
    setModalOpen(false);
  };

  const checkAnswer = (ans) => {
    try {
      setAnswer((prev) => {
        const questionId = quiz[currentQues]?._id;
        const existingAnswerIndex = prev.findIndex(
          (item) => item.questionId === questionId
        );

        const newAnswer = {
          questionId,
          answer: ans,
          isCorrect: ans === quiz[currentQues]?.correctAnswer,
        };

        if (existingAnswerIndex !== -1) {
          return prev.map((item, index) =>
            index === existingAnswerIndex ? newAnswer : item
          );
        } else {
          return [...prev, newAnswer];
        }
      });
    } catch (error) {
      console.error("Error selecting answer:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await dispatch(
        addTest({ surahId: id, answers: answer })
      )?.unwrap();
      setResult(response?.data);
      setCurrentQues(0);
      handleModalOpen();
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  const handleReset = () => {
    setCurrentQues(0);
    setAnswer([]);
    setPreview(false);
  };

  const currentQuestion = quiz[currentQues];
  const selectedAnswer = answer.find(
    (a) => a.questionId === currentQuestion._id
  )?.answer;

  return (
    <>
      {modalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-30">
            <div className="bg-white border-8 border-l-[#3DB47D] border-t-[#3DB47D] border-[#2372B9] rounded-3xl shadow-lg p-6 w-[90%] md:w-[400px] max-h-[44vh]  relative">
              <button
                onClick={handleModalClose}
                className="absolute top-3 right-3 hover:cursor-pointer text-gray-500 hover:text-gray-800 z-30"
              >
                ✕
              </button>

                <QuizProgress
                  result={result} 
                  detail={detail}
                  handleModalClose={handleModalClose}
                  handlePreview={handlePreview}
                  setAnswer={setAnswer}
                  setPreview={setPreview}
                />
            </div>
          </div>,
          document.getElementById("modal-root") || document.body
        )}

      <Modal id="quiz-modal" type="purple" hideClose>
        <QuizProgress
          result={result}
          detail={detail}
          handleModalClose={handleModalClose}
          handlePreview={handlePreview}
          setAnswer={setAnswer}
          setPreview={setPreview}
        />
      </Modal>

      {!profile ? (
        <TestModalWithoutUser />
      ) : (
        <div className="bg-white mt-2 rounded-xl p-6 shadow-md">
          <h3 className="text-[#39BA92] text-2xl font-semibold font-calsans pt-2">
            {t("TestYourself")}
          </h3>

          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-5">
            <ChevronLeft color="#39BA92" size={35} />
            <h2 className="text-3xl font-medium text-[#39BA92] font-calsans">
              Quiz
            </h2>
            <span className="text-2xl text-[#39BA92] font-calsans">
              {currentQues + 1}/{quiz?.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className="bg-[#2372B9] h-8 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${progressPercentage}%` }}
              >
                <span className="text-white text-lg font-calsans">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-2xl font-medium text-[#3C3C3C] text-center font-calsans">
              {quiz[currentQues]?.text}
            </h3>
          </div>

          {/* Answers */}
          <div className="space-y-4 mb-6 px-6">
            {quiz[currentQues]?.answers?.map((ans, index) => {
              const isCorrect = quiz[currentQues]?.correctAnswer === ans;
              const isSelected = answer.some(
                (a) =>
                  a.answer === ans && a.questionId === quiz[currentQues]?._id
              );

              return (
                <button
                  key={index}
                  onClick={() => !preview && checkAnswer(ans)}
                  className={`w-full p-4 text-center rounded-full border-2 transition-all duration-200 font-medium text-lg font-plusJakartaSans
                  ${
                    preview && isCorrect
                      ? "border-green-500 bg-green-100 text-green-800"
                      : preview && isSelected && !isCorrect
                      ? "border-red-500 bg-red-100 text-red-800"
                      : selectedAnswer === ans
                      ? "border-[#2372B9] bg-blue-50 text-[#2372B9]"
                      : "border-[#2372B9] bg-white hover:bg-blue-50"
                  }`}
                >
                  {preview && (isCorrect || (isSelected && !isCorrect)) ? (
                    <div className="flex items-center justify-between w-full">
                      {isCorrect ? (
                        <>
                          <div className="text-center flex-1">{ans}</div>
                          <Check className="w-5 h-5 text-green-600" />
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-red-600" />
                          <div className="text-center flex-1">{ans}</div>
                        </>
                      )}
                    </div>
                  ) : (
                    ans
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentQues > 0 && (
              <Button2
                text="Previous"
                onClick={handlePrevQues}
                className="px-6 py-3 rounded-full border-2 border-blue-500 bg-white text-blue-500 font-medium transition-all duration-200 hover:bg-blue-50"
              >
                Previous
              </Button2>
            )}

            {currentQues === totalQuestions ? (
              <Button2
                onClick={handleSubmit}
                className="px-6 py-3 rounded-full border-2 border-green-500 bg-green-100 text-green-800 font-medium transition-all duration-200 hover:bg-green-200"
              >
                Submit
              </Button2>
            ) : (
              <Button2
                onClick={handleNextQues}
                disabled={!selectedAnswer}
                className={`px-6 py-3 rounded-full border-2 font-medium transition-all duration-200 ${
                  selectedAnswer
                    ? "border-blue-500 bg-white text-blue-500 hover:bg-blue-50"
                    : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </Button2>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TestTabContent;
