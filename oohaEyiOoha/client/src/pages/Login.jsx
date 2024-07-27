import React from 'react';
import styled from 'styled-components';
import backgroundImage from '../assets/mg.png';

const Container = styled.div`
  background-color: transparent; 
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 50vw;
  max-width: 100%;
  min-height: 30vw;
`;

const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  ` : null}
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;

const Form = styled.form`
  background-color: rgb(255, 237, 213, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  top: 0;
  margin-bottom: 1vh;
  font-size: x-large;
`;

const Input = styled.input`
  background-color: rgba(255, 237, 213, 1); 
  border: 1px solid brown;
  border-radius: 2vh;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;  
  background-color: rgba(67, 20, 7, 1); 
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const GhostButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #ffffff;
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props => props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
  background: rgba(67, 20, 7, 1); 
  /* background: linear-gradient(to right,  rgba(67, 20, 7, 1), rgba(235, 152, 78, 1));
  background: linear-gradient(to left, rgba(235, 152, 78, 1), rgba(67, 20, 7, 1)); */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => props.signinIn !== true ? `transform: translateX(50%);` : null}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  background: transparent; /* Set background to transparent */
`;

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
`;

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

function Login() {
  const [signIn, setSignIn] = React.useState(true);

  const toggle = (signInState) => {
    setSignIn(signInState);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`, // Background image added here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(251, 146, 60, 0.3)',
      }}>
        <Container>
          <SignUpContainer signinIn={signIn}>
            <Form>
              <Title className='title'>Create Account</Title>
              <Input type="text" placeholder='Name' />
              <Input type="email" placeholder='Email' />
              <Input type="password" placeholder='Password' />
              <Input type="language" placeholder='Language' />
              <Button>Sign Up</Button>
            </Form>
          </SignUpContainer>
          <SignInContainer signinIn={signIn}>
            <Form>
              <Title className='title'>Log In </Title>
              <Input type="email" placeholder='Email' />
              <Input type="password" placeholder='Password' />
              <Anchor href='#'>Forgot your password?</Anchor>
              <Button>Sign In</Button>
            </Form>
          </SignInContainer>
          <OverlayContainer signinIn={signIn}>
            <Overlay signinIn={signIn}>
              <LeftOverlayPanel signinIn={signIn}>
                <Title className='title'>Welcome chef!</Title>
                <Paragraph>
                  Already a member ?
                </Paragraph>
                <GhostButton onClick={() => toggle(true)}>
                  Sign In
                </GhostButton>
              </LeftOverlayPanel>
              <RightOverlayPanel signinIn={signIn}>
                <Title className='title'>Hello, chef!</Title>
                <Paragraph>
                  Not a member ?
                </Paragraph>
                <GhostButton onClick={() => toggle(false)}>
                  Sign Up
                </GhostButton>
              </RightOverlayPanel>
            </Overlay>
          </OverlayContainer>
        </Container>
      </div>
    </div>
  );
}

export default Login;
