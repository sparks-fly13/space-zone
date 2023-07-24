import { useState } from "react";
import { FormControl, FormLabel, FormHelperText, Input, Button, Flex, Box, InputGroup, InputRightElement, Link, useToast } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import {useHistory} from 'react-router-dom'

function Signup() {
    const history = useHistory();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPwd, setConfirmPwd] = useState('');

    const googleAuth = () => {
        window.open('http://127.0.0.1:3000/auth/google', '_self');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if(password !== confirmPwd) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                status: 'error',
                duration: '5000',
                isClosable: true
            });
            return;
        }
        try {
            const {data} = await axios.post('/signup', {
                email,
                password,
                firstName,
                lastName
            });
                history.push('/profile');
                window.location.reload();
            return data;
        } catch (err) {
            if (err.response) {
                console.log(err.response.data.error)
                toast({
                    title: 'Error',
                    description: err.response.data.error[0].msg ? err.response.data.error[0].msg : err.response.data.error,
                    status: 'error',
                    duration: '5000',
                    isClosable: true
                });
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                console.log(err.request);
            } else {
                console.log('Error', err.message);
        }
        }
    }
    return (
        <Flex mt={40} width="full" align="center" justifyContent="center">
            <Box width="xl" p={8} borderWidth={1} borderRadius={13} borderColor="aliceblue" boxShadow="lg">
                <Box textAlign="center" fontSize="xl">
                    <h1>Signup</h1>
                </Box>
                <Box my={4} textAlign="left">
                    <form  onSubmit={handleFormSubmit}>
                        <FormControl isRequired my={3}>
                            <FormLabel>First Name</FormLabel>
                            <Input value={firstName} onChange={e => setFirstName(e.currentTarget.value)} variant="flushed" type="text" placeholder="Enter your first name" autoComplete="off" />
                        </FormControl>
                        <FormControl isRequired my={3}>
                            <FormLabel>Last Name</FormLabel>
                            <Input value={lastName} onChange={e => setLastName(e.currentTarget.value)} variant="flushed" type="text" placeholder="Enter your last name" autoComplete="off" />
                        </FormControl>
                        <FormControl isRequired my={3}>
                            <FormLabel>Email address</FormLabel>
                            <Input value={email} onChange={e => setEmail(e.currentTarget.value)} variant="flushed" type="email" placeholder="Enter email" autoComplete="off" />
                            <FormHelperText>We'll never share your email.</FormHelperText>
                        </FormControl>
                        <FormControl isRequired my={6}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input value={password} type={showPassword ? 'text' : 'password'} onChange={e => setPassword(e.currentTarget.value)} variant="flushed" placeholder="password" autoComplete="off" />
                                <InputRightElement width="3rem">
                                <Button h="1.5rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired my={6}>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input value={confirmPwd} type={showPassword ? 'text' : 'password'} onChange={e => setConfirmPwd(e.currentTarget.value)} variant="flushed" placeholder="confirm your password" autoComplete="off" />
                                <InputRightElement width="3rem">
                                <Button h="1.5rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button width="full" type="submit">Signup</Button>
                    </form>
                    <h1 style={{textAlign: "center"}}>OR</h1>
                    <Box textAlign="center" fontSize="xl">
                    <Button onClick={googleAuth} color="teal.500" ml={2}>Signup with Google</Button>
                    </Box>
                </Box>
                <Box>
                    <p>Already have an account?
                        <Link href="/login" color="teal.500" ml={2}>Login</Link>
                    </p>
                </Box>
            </Box>
        </Flex>
    );
}

export default Signup;