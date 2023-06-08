import { useCallback, useEffect, useMemo, useState } from 'react';

function constructSpeechRecognition(): SpeechRecognition {
  if (typeof SpeechRecognition !== 'undefined') {
    return new SpeechRecognition();
  } else if (typeof webkitSpeechRecognition !== 'undefined') {
    return new (webkitSpeechRecognition as any)();
  }

  throw new Error('SpeechRecognition not found in window.');
}

const App = () => {
  const [started, setStarted] = useState(false);

  const recognition = useMemo(() => {
    const recognition = constructSpeechRecognition();

    recognition.lang = 'en';
    recognition.interimResults = true;

    return recognition;
  }, []);

  const handleRecognizeButtonClick = useCallback(() => {
    setStarted(true);

    recognition.start();
  }, [recognition, setStarted]);

  const handleRecognitionEnd = useCallback(() => {
    setStarted(false);
  }, [setStarted]);

  const handleRecognitionError = useCallback((event: any) => {
    console.log(event);
  }, []);

  const handleRecognitionResult = useCallback((event: SpeechRecognitionEvent) => {
    console.log(event.results);
  }, []);

  useEffect(() => {
    recognition.addEventListener('end', handleRecognitionEnd);
    recognition.addEventListener('error', handleRecognitionError);
    recognition.addEventListener('result', handleRecognitionResult);

    return () => {
      recognition.removeEventListener('end', handleRecognitionEnd);
      recognition.removeEventListener('error', handleRecognitionError);
      recognition.removeEventListener('result', handleRecognitionResult);
    };
  }, [handleRecognitionResult, recognition]);

  return (
    <main>
      <h1>Hello, World!</h1>
      <button disabled={started} onClick={handleRecognizeButtonClick} type="button">
        Recognize
      </button>
    </main>
  );
};

export default App;
