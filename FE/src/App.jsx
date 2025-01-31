import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { LandingPage } from "./pages/LandingPage"
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { ResultPage } from "./pages/ResultPage";
import { RecoilRoot } from "recoil";

function App() {

  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App
