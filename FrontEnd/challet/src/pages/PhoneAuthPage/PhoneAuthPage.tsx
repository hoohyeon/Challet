import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 가져오기
import axiosInstance from '../../api/axiosInstance'; // Axios 인스턴스 가져오기
import { AxiosError } from 'axios'; // AxiosError 타입 가져오기

const PhoneAuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 시작 여부
  const [timeRemaining, setTimeRemaining] = useState(180); // 3분 카운트다운 (180초)
  const [isCheckingPhoneNumber, setIsCheckingPhoneNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호 입력값
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호가 발송되었는지 여부
  const [verificationSuccess, setVerificationSuccess] = useState(false); // 인증 성공 여부
  const [isRequestSent, setIsRequestSent] = useState(false); // 요청이 한 번이라도 되었는지 여부

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, ''); // 숫자만 남김
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 7)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  // 전화번호 변경 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = formatPhoneNumber(e.target.value); // 전화번호 자동 포맷팅
    setPhoneNumber(input);

    // 포맷된 전화번호가 13자리일 경우(010-1234-5678) 버튼 활성화
    setIsButtonDisabled(input.length !== 13 || isRequestSent);
  };

  // 인증번호 요청 시 3분 카운트다운 시작
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false); // 타이머 종료
    }
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [isTimerRunning, timeRemaining]);

  // 전화번호 인증 요청 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsCheckingPhoneNumber(true); // 전화번호 체크 중

      // 전화번호 인증번호 전송 API 요청
      const response = await axiosInstance.post('/api/challet/auth/sms', {
        phoneNumber: phoneNumber.replace(/-/g, ''), // 하이픈 제거 후 전송
      });

      if (response.status === 200) {
        console.log(`인증 요청 전화번호: ${phoneNumber}`);
        setIsTimerRunning(true); // 타이머 시작
        setTimeRemaining(180); // 3분(180초)으로 초기화
        setIsCodeSent(true); // 인증번호 입력창을 표시하도록 설정
        setIsRequestSent(true); // 요청이 한 번 되었다는 상태 설정
        setIsButtonDisabled(true); // 버튼 비활성화
      }
    } catch (error: unknown) {
      // error가 AxiosError인지 체크
      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.message || '인증번호 요청에 실패했습니다.'
        );
      } else if (error instanceof Error) {
        // 기타 일반적인 오류 처리
        setErrorMessage(error.message || '알 수 없는 오류가 발생했습니다.');
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsCheckingPhoneNumber(false); // 전화번호 체크 완료
    }
  };

  // 인증번호 확인 처리
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        '/api/challet/auth/sms/certificate',
        {
          phoneNumber: phoneNumber.replace(/-/g, ''), // 하이픈 제거 후 전송
          code: verificationCode, // 입력한 인증번호 전송
        }
      );

      if (response.status === 200) {
        setVerificationSuccess(true); // 인증 성공 상태로 설정
        console.log(`인증 성공: ${response.data}`);

        // 인증 성공 시 phone-check로 이동하며 입력한 전화번호를 넘김
        navigate('/phone-check', { state: { phoneNumber } });
      }
    } catch (error: unknown) {
      // error가 AxiosError인지 체크
      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.message || '인증번호 확인에 실패했습니다.'
        );
      } else if (error instanceof Error) {
        // 기타 일반적인 오류 처리
        setErrorMessage(error.message || '알 수 없는 오류가 발생했습니다.');
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 남은 시간을 mm:ss 형식으로 변환하는 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='w-full max-w-md p-8 space-y-6 mb-48'>
      <div className='mb-4'>
        <div className='text-left mb-6'>
          <p className='text-xl font-bold text-gray-800'>휴대폰 번호를</p>
          <p className='text-xl text-gray-800'>입력해주세요</p>
        </div>

        {/* 전화번호 입력 필드 */}
        <div className='w-full border-b-2 border-teal-500 focus-within:border-teal-600'>
          <input
            type='tel'
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder='010-0000-0000'
            className='w-full text-lg font-bold text-gray-800 px-3 py-2 focus:outline-none'
            maxLength={13}
            required
          />
        </div>

        {/* 전화번호 확인 중 메시지 */}
        {isCheckingPhoneNumber && (
          <p className='text-teal-500 text-sm mt-2'></p>
        )}
      </div>

      {/* 인증번호 받기 버튼 */}
      <form onSubmit={handleSubmit}>
        <button
          type='submit'
          className={`w-full text-white bg-teal-500 py-2 rounded ${
            isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isButtonDisabled}
        >
          인증번호 받기
        </button>
      </form>

      {/* 인증번호 입력창 및 확인 버튼 */}
      {isCodeSent && (
        <form
          onSubmit={handleVerificationSubmit}
          className='mt-4 flex items-center'
        >
          <input
            type='text'
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, ''))
            } // 숫자만 입력 가능
            placeholder='인증번호 입력'
            maxLength={6}
            className='w-40 text-lg font-bold text-gray-800 px-3 py-2 border-b-2 border-teal-500 focus:outline-none'
            required
          />
          <button
            type='submit'
            className={`ml-auto py-2 px-4 rounded ${
              verificationCode.length === 6
                ? 'bg-teal-500 text-white hover:bg-teal-600' // 활성화 상태일 때 버튼 스타일
                : 'bg-gray-400 text-gray-200 cursor-not-allowed' // 비활성화 상태일 때 스타일
            }`}
            disabled={verificationCode.length !== 6} // 인증번호가 6자리가 아니면 비활성화
          >
            확인
          </button>
        </form>
      )}

      {/* 카운트다운 표시 */}
      {isTimerRunning && (
        <p className='text-red-500 text-center text-lg mt-4'>
          남은 시간: {formatTime(timeRemaining)}
        </p>
      )}

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>
      )}

      {/* 인증 성공 메시지 */}
      {verificationSuccess && (
        <p className='text-green-500 text-center text-lg mt-4'>
          인증이 성공적으로 완료되었습니다!
        </p>
      )}
    </div>
  );
};

export default PhoneAuthPage;
