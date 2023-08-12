import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Image, Text, Flex, Box } from "@chakra-ui/react";
import noPfp from '../assets/zerotwoicon.png';
import Feedback from "../Components/feedback";
import ImageClass from "../Components/imageClass";
import Navbar from "../Components/Navbar";

function UserPage() {
    const history = useHistory();
    const { user } = useContext(UserContext);

    const handleLogOut = async (e) => {
        e.preventDefault();
        try {
            await axios.get('/logout');
            history.replace('/');
            window.location.reload();
    } catch(err) {
        console.log(err.response);
    }
}
    return(
            <div>
                <Navbar />
                {!!user ? 
                    <Flex direction="column" align="center" justify="center">
                        <Box textAlign="center" fontSize="xl">
                            {(user.userImage === 'img' ? (
                            <Image src={noPfp} alt="profile" width='100px' />
                            ) : (
                            <Image src={user.userImage} alt="profile" />
                            ))}
                        </Box>
                        <Text>{user.firstName} {user.lastName}</Text>
                        <Text>{user.email}</Text>
                        <Button onClick={handleLogOut}>Log Out</Button>
                        <Feedback />
                        <ImageClass />
                    </Flex>
                : null
                }
            </div>
    );
}

export default UserPage;