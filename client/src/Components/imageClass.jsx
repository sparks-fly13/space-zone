import { useState } from "react";
import axios from "axios";
import { Button, Flex, Input, Image, Box } from "@chakra-ui/react";

function ImageClass() {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const { data } = await axios.post('/analyze-image', formData);
            setResponse(data.prediction);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

    const clearContents = () => {
        setImage('');
        setFile('');
        setResponse('');
    }

    return (
        <Flex>
            <Box width="xl" p={8} borderWidth={1} borderRadius={13} borderColor="aliceblue" boxShadow="lg">
                <Input accept=".jpg, .jpeg, .png, .bmp" maxWidth='-moz-fit-content' type="file" onChange={(e) => {
                    setFile(e.target.files[0])
                    setImage(URL.createObjectURL(e.target.files[0]))
                    }} />
                <Image src={image} width="150px" />
                <Button onClick={handleSubmit}>Classify</Button>
                <Button left='8xl' onClick={clearContents}>Clear</Button>
                {response && <p>Response: {response}</p>}
            </Box>
        </Flex>
    )
}

export default ImageClass;