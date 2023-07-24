import { useState } from "react";
import axios from "axios";
import { Button, Textarea } from "@chakra-ui/react";

function Feedback() {
    const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/analyze-feedback', {
        feedback: feedback,
      });
      console.log(response.data.category);
      setResponse(response.data.reply);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div>
      <Textarea size='sm' value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Give us your feedback" />
      <Button onClick={handleSubmit}>Submit</Button>
      {response && <p>Response: {response}</p>}
    </div>
  );
}

export default Feedback;