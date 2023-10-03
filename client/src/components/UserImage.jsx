import { Box } from "@mui/material";
import { back_url } from "utils/config";
const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        src={image==="" ? "../assets/default_user.jpg" : `${back_url}/file/${image}` }
        alt="User"
      />
    </Box>
  );
};

export default UserImage;
