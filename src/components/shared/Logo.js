// Logo component placeholder
// Replace this with your actual logo component

import { Box, Image, Heading } from "@chakra-ui/react";

const Logo = ({ isMobile = false }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {/* Replace this with your logo image */}
      {/* <Image 
        src="/your-logo.png" 
        alt="Home Admin Logo" 
        height={isMobile ? "32px" : "40px"}
        width="auto"
      /> */}
      
      {/* Temporary text logo - replace with your logo */}
      <Heading
        size={isMobile ? "md" : "lg"}
        color="accent.emphasis"
        fontWeight="extrabold"
        letterSpacing="wide"
      >
        Home Admin
      </Heading>
    </Box>
  );
};

export default Logo;
